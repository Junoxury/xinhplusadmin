-- 대시보드 통계 데이터를 가져오는 함수
CREATE OR REPLACE FUNCTION get_dashboard_stats(
    start_date timestamp with time zone,
    end_date timestamp with time zone
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'userCount', json_build_object(
            'total', (
                SELECT COUNT(*)
                FROM auth.users
                WHERE deleted_at IS NULL
            ),
            'period', (
                SELECT COUNT(*)
                FROM auth.users
                WHERE created_at BETWEEN start_date AND end_date
                AND deleted_at IS NULL
            )
        ),
        'hospitalCount', json_build_object(
            'total', (
                SELECT COUNT(*)
                FROM hospitals
            ),
            'period', (
                SELECT COUNT(*)
                FROM hospitals
                WHERE created_at BETWEEN start_date AND end_date
            )
        ),
        'treatmentCount', json_build_object(
            'total', (
                SELECT COUNT(*)
                FROM treatments
            ),
            'period', (
                SELECT COUNT(*)
                FROM treatments
                WHERE created_at BETWEEN start_date AND end_date
            )
        ),
        'reviewCount', json_build_object(
            'total', (
                SELECT COUNT(*)
                FROM reviews
                WHERE status = 'published'
            ),
            'period', (
                SELECT COUNT(*)
                FROM reviews
                WHERE created_at BETWEEN start_date AND end_date
                AND status = 'published'
            )
        )
    ) INTO result;

    RETURN result;
END;
$$; 