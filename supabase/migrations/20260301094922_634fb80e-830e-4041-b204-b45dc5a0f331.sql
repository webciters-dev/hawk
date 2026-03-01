
-- Create a public storage bucket for CMS uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-uploads', 'cms-uploads', true);

-- Allow anyone to read files (public bucket)
CREATE POLICY "Public can read cms uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'cms-uploads');

-- Allow admins to upload files
CREATE POLICY "Admins can upload cms files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cms-uploads' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to update files
CREATE POLICY "Admins can update cms files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cms-uploads' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete files
CREATE POLICY "Admins can delete cms files"
ON storage.objects FOR DELETE
USING (bucket_id = 'cms-uploads' AND public.has_role(auth.uid(), 'admin'));
