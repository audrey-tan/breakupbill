import React from 'react';
import animationData from '../public/lottie/loading.json';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function App() {
  return (
    <div>
      <Lottie animationData={animationData} loop={true} autoplay/>
    </div>
  );
}