-- ============================================================================
-- ENUM: user_role
-- Description: Define os níveis de acesso do usuário no sistema
-- Values:
--   - ADMIN: Acesso administrativo completo
--   - USER: Acesso padrão de usuário
--   - CLIENT: Acesso de cliente
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'user_role'
    ) THEN
        CREATE TYPE user_role AS ENUM (
            'ADMIN',
            'USER',
            'CLIENT'
        );
    END IF;
END$$;