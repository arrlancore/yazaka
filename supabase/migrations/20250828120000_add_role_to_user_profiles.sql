-- Add role column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Update existing users to have 'user' role by default
UPDATE user_profiles SET role = 'user' WHERE role IS NULL;

-- Create policy for admins to read all profiles
CREATE POLICY "Admins can read all profiles" 
    ON user_profiles FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policy for admins to update all profiles
CREATE POLICY "Admins can update all profiles" 
    ON user_profiles FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );