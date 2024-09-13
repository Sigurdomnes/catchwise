'use client';

import { TableSort } from '@/components/TableSort/TableSort';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Params {
  params: {
    company: string;
  };
}

export default function Param({ params }: Params) {
  const { company } = params
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the corresponding JSON file based on the slug
    console.log(company)
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${company}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [company]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section style={{padding: '2rem 3rem'}}>
      <h1>Data for {company}</h1>
      <br></br>
      {data &&
        <TableSort data={ data.fiskstat }></TableSort>
      }
    </section>
  );
}