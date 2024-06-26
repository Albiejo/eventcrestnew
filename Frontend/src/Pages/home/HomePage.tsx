import { Suspense, lazy } from 'react';

const Hero = lazy(() => import('../../Components/Home/Hero'));
const Footer = lazy(() => import('../../Components/Home/Footer'));
const VendorList = lazy(() => import('../../Components/Home/VendorList'));
const Hero2 = lazy(() => import('../../Components/Home/Hero2'));
const Hero3 = lazy(() => import('../../Components/Home/Hero3'));
const Faq = lazy(() => import('../../Components/Home/Faq'));
const Hero5 = lazy(()=> import('../../Components/Home/Hero5'))

import LoaderSample from '../../Components/Common/LoaderSample';

function Home() {

  return (
    <>
      <Suspense fallback={<LoaderSample/>}>
        <Hero />
        <VendorList />
        <Hero2 />
        <Hero3 />
        <Hero5/>
        <Faq/>
        <Footer />
      </Suspense>
    </>
  );
}

export default Home;
