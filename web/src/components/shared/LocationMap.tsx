'use client';

/**
 * 위치 안내 영역 — 화면 안에서 실제 지도가 바로 보인다.
 *
 * 두 가지 방식을 쓴다.
 *  1. 카카오 지도 JavaScript 키(NEXT_PUBLIC_KAKAO_MAP_KEY)가 등록돼 있으면
 *     확정된 주소를 지오코딩해 그 좌표에 지도 · 마커 · 확대/축소를 그린다.
 *  2. 키가 없으면(현재) 키가 필요 없는 지도 임베드로 같은 주소를 바로 띄운다.
 *     주소는 `src/lib/map.ts` 의 확정값 하나만 쓴다 — 좌표를 직접 적거나
 *     임의의 위치를 만들지 않는다.
 *
 * 어느 쪽이든 카카오맵으로 나가는 링크(길찾기 포함)를 함께 둔다.
 * 상자 크기 · 배경 · 테두리는 이 컴포넌트를 쓰는 화면이 className 으로 정한다.
 */

import { useEffect, useRef, useState } from 'react';
import {
  KAKAO_MAP_KEY, OFFICE_PLACE_NAME, embedMapUrl, kakaoRouteUrl, kakaoSearchUrl,
} from '@/lib/map';
import { VISIT_ADDRESS } from '@/data/business';
import styles from './LocationMap.module.css';

/* --- SDK 최소 타입. 전역 any 를 두지 않으려고 쓰는 만큼만 적는다. --- */
type LatLng = object;
interface Geocoded { x: string; y: string }
interface KakaoMapInstance { addControl(control: object, position: unknown): void }
interface KakaoMaps {
  load(cb: () => void): void;
  LatLng: new (lat: number, lng: number) => LatLng;
  Map: new (el: HTMLElement, opts: { center: LatLng; level: number }) => KakaoMapInstance;
  Marker: new (opts: { map: KakaoMapInstance; position: LatLng }) => object;
  ZoomControl: new () => object;
  ControlPosition: { RIGHT: unknown };
  services: {
    Geocoder: new () => {
      addressSearch(q: string, cb: (result: Geocoded[], status: string) => void): void;
    };
    Status: { OK: string };
  };
}
declare global {
  interface Window { kakao?: { maps: KakaoMaps } }
}

const SDK_ID = 'kakao-maps-sdk';

function loadSdk(key: string): Promise<KakaoMaps> {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) return resolve(window.kakao.maps);
    const done = () => (window.kakao?.maps ? resolve(window.kakao.maps) : reject(new Error('sdk')));
    const existing = document.getElementById(SDK_ID);
    if (existing) {
      existing.addEventListener('load', done);
      existing.addEventListener('error', () => reject(new Error('sdk')));
      return;
    }
    const el = document.createElement('script');
    el.id = SDK_ID;
    el.async = true;
    /* autoload=false — kakao.maps.load() 로 직접 초기화한다. */
    el.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`;
    el.addEventListener('load', done);
    el.addEventListener('error', () => reject(new Error('sdk')));
    document.head.appendChild(el);
  });
}

type Props = {
  /** 지도 중심이 될 주소. 기본값은 확정된 사업장 주소다. */
  address?: string;
  /** 지도의 이름(스크린리더 · iframe 제목). */
  label: string;
  /** 상자의 크기 · 위치 · 배경을 정하는 화면 쪽 클래스. */
  className?: string;
};

export default function LocationMap({ address = VISIT_ADDRESS, label, className }: Props) {
  const canvas = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    if (!KAKAO_MAP_KEY) return;                 /* 키가 없으면 임베드 지도를 쓴다 */
    let dropped = false;

    loadSdk(KAKAO_MAP_KEY)
      .then((maps) => {
        maps.load(() => {
          if (dropped || !canvas.current) return;
          new maps.services.Geocoder().addressSearch(address, (result, status) => {
            if (dropped || !canvas.current) return;
            if (status !== maps.services.Status.OK || !result[0]) return;   /* 못 찾으면 임베드 지도가 남는다 */
            const lat = Number(result[0].y);
            const lng = Number(result[0].x);
            const center = new maps.LatLng(lat, lng);
            const map = new maps.Map(canvas.current, { center, level: 3 });
            map.addControl(new maps.ZoomControl(), maps.ControlPosition.RIGHT);
            new maps.Marker({ map, position: center });
            setCoords({ lat, lng });
            setKakaoReady(true);
          });
        });
      })
      .catch(() => { /* 카카오 지도를 못 켜면 임베드 지도가 그대로 보인다 */ });

    return () => { dropped = true; };
  }, [address]);

  return (
    <div className={[className, styles.box].filter(Boolean).join(' ')} data-map="live">
      {/* 카카오 지도(키가 있을 때) */}
      <div ref={canvas} className={styles.canvas} hidden={!kakaoReady}
           role={kakaoReady ? 'img' : undefined} aria-label={kakaoReady ? address : undefined} />

      {/* 키가 없을 때 — 키 없이 쓰는 임베드 지도로 같은 주소를 바로 보여준다 */}
      {!kakaoReady && (
        <iframe className={styles.canvas} title={label} src={embedMapUrl(address)}
                loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen={false} />
      )}

      <span className={styles.links}>
        <a className={styles.link} href={kakaoSearchUrl(address)}
           target="_blank" rel="noopener noreferrer">카카오맵에서 보기</a>
        {coords && (
          <a className={styles.link}
             href={kakaoRouteUrl(OFFICE_PLACE_NAME, coords.lat, coords.lng)}
             target="_blank" rel="noopener noreferrer">길찾기</a>
        )}
      </span>
    </div>
  );
}
