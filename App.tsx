import React, { useState, useCallback } from 'react';
import { supabase } from './supabase';

const App: React.FC = () => {

  const handleFilesSelected = useCallback(async (files: File[]) => {

    for (const file of files) {

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(`files/${Date.now()}_${file.name}`, file);

      if (error) {
        console.error(error);
      } else {
        console.log("Uploaded:", data);
      }

    }

  }, []);

  return (
    <div>
      <h1>Second Brain AI ✅</h1>
    </div>
  );

};

export default App;
