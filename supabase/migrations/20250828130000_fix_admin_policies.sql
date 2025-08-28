-- Drop the problematic admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- Create a simpler admin policy using a function to avoid recursion
CREATE OR REPLACE FUNCTION is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Create new admin policies that use the function
CREATE POLICY "Admins can read all profiles" 
    ON user_profiles FOR SELECT 
    USING (
        auth.uid() = id OR is_admin_user(auth.uid())
    );

CREATE POLICY "Admins can update all profiles" 
    ON user_profiles FOR UPDATE 
    USING (
        auth.uid() = id OR is_admin_user(auth.uid())
    );