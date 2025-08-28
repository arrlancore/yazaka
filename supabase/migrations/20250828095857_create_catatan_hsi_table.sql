-- Create enum for status
CREATE TYPE catatan_hsi_status AS ENUM ('raw', 'draft', 'published');

-- Create catatan_hsi table
CREATE TABLE catatan_hsi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Content fields
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    transcription TEXT NOT NULL,
    content TEXT, -- AI enhanced MDX content
    
    -- Frontmatter fields matching MDX
    ustad TEXT NOT NULL,
    published_at DATE NOT NULL,
    summary TEXT NOT NULL,
    audio_src TEXT, -- filename for R2: "HSI 09 ~ Halaqah 03 dari 25.mp3"
    series TEXT NOT NULL,
    episode INTEGER NOT NULL,
    total_episodes INTEGER NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    source TEXT NOT NULL,
    
    -- System fields
    status catatan_hsi_status NOT NULL DEFAULT 'raw',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_catatan_hsi_slug ON catatan_hsi(slug);
CREATE INDEX idx_catatan_hsi_status ON catatan_hsi(status);
CREATE INDEX idx_catatan_hsi_series ON catatan_hsi(series);
CREATE INDEX idx_catatan_hsi_episode ON catatan_hsi(episode);
CREATE INDEX idx_catatan_hsi_created_by ON catatan_hsi(created_by);
CREATE INDEX idx_catatan_hsi_created_at ON catatan_hsi(created_at);

-- Create unique constraint on series + episode
CREATE UNIQUE INDEX idx_catatan_hsi_series_episode ON catatan_hsi(series, episode);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_catatan_hsi_updated_at
    BEFORE UPDATE ON catatan_hsi
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE catatan_hsi ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read all published catatan_hsi" 
    ON catatan_hsi FOR SELECT 
    USING (status = 'published' OR auth.uid() = created_by);

CREATE POLICY "Users can create their own catatan_hsi" 
    ON catatan_hsi FOR INSERT 
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own catatan_hsi" 
    ON catatan_hsi FOR UPDATE 
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own catatan_hsi" 
    ON catatan_hsi FOR DELETE 
    USING (auth.uid() = created_by);