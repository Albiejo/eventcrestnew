import { Suspense, lazy } from 'react';

const Hero = lazy(() => import('../../Components/Home/Hero'));
const Footer = lazy(() => import('../../Components/Home/Footer'));
const VendorList = lazy(() => import('../../Components/Home/VendorList'));
const Hero2 = lazy(() => import('../../Components/Home/Hero2'));
const Hero3 = lazy(() => import('../../Components/Home/Hero3'));
const Hero4 = lazy(() => import('../../Components/Home/Hero4'));
const Faq = lazy(() => import('../../Components/Home/Faq'));


import LoadingSpinner from '../../Components/Common/LoadingSpinner';



function Home() {



  
  return (
    <>
      <Suspense fallback={<LoadingSpinner/>}>
        <Hero />
        <VendorList />
        <Hero2 />
        <Hero3 />
        <Hero4 />
        <Faq/>
        <Footer />
      </Suspense>
    </>
  );
}

export default Home;
