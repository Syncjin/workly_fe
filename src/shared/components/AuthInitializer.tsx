'use client';

import { getCsrfTokenFromCookie, getTokenStatus, initializeAuth } from '@/shared/lib/auth';
import { useEffect } from 'react';

/**
 * 앱 시작 시 인증 상태를 초기화하는 컴포넌트
 * - RT는 HttpOnly라 JS로 읽지 않음 (읽으려 하지 않음)
 * - initializeAuth()가 RT 쿠키 기반으로 AT 재발급을 "시도"하여 성공/실패로 판단
 */
export function AuthInitializer() {
    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                console.log('🔄 인증 초기화 시작...');

                // 초기화 전 상태(AT/CSRF만 관찰)
                const beforeStatus = getTokenStatus();
                const csrfTokenFromCookie = getCsrfTokenFromCookie();

                console.log('초기화 전 상태:', {
                    tokenStatus: beforeStatus,
                    hasCsrfTokenInCookie: !!csrfTokenFromCookie,
                    csrfTokenPreview: csrfTokenFromCookie ? `${csrfTokenFromCookie.slice(0, 10)}...` : null,
                });

                // 핵심: RT를 JS로 읽지 않고, refresh 시도 결과로 판단
                const isAuthenticated = await initializeAuth();

                if (!isMounted) return;

                const afterStatus = getTokenStatus();
                console.log('✅ 인증 초기화 완료:', {
                    isAuthenticated,
                    beforeStatus,
                    afterStatus,
                });

                // 선택적으로, 실패 시 추가 안내
                if (!isAuthenticated) {
                    console.warn('⚠️ 인증 초기화 실패: RT 쿠키가 없거나 무효일 수 있습니다.');
                }
            } catch (error) {
                if (isMounted) console.error('❌ 인증 초기화 실패:', error);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return null;
}
