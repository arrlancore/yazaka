-- Add learning_objectives column to catatan_hsi table
ALTER TABLE catatan_hsi 
ADD COLUMN learning_objectives TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN catatan_hsi.learning_objectives IS 'AI-generated learning objectives including conceptual points and dalil references';

-- Create index for performance when filtering by learning objectives
CREATE INDEX idx_catatan_hsi_learning_objectives ON catatan_hsi USING GIN (learning_objectives);