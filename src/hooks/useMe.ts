'use client';

import { useState, useEffect } from 'react';

export interface MeData {
  nickname: string;
  email: string;
  profileImage: string | null;
  jobs: string[];
}

export function useMe() {
  const [data, setData] = useState<MeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/members/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(json => {
        const d = json.data || json;
        setData({
          nickname: d.nickname || d.nick_name || d.name || '',
          email: d.email || '',
          profileImage: d.profile_image || d.profileImage || d.profile_image_url || null,
          jobs: d.jobs || d.job_categories || [],
        });
      })
      .catch(() => {
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
