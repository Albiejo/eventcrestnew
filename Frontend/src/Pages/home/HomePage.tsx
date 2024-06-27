import { Suspense, lazy } from 'react';

const Hero = lazy(() => import('../../Components/Home/Hero'));
const Footer = lazy(() => import('../../Components/Home/Footer'));
const VendorList = lazy(() => import('../../Components/Home/VendorList'));
const Hero2 = lazy(() => import('../../Components/Home/Hero2'));
const Hero3 = lazy(() => import('../../Components/Home/Hero3'));
const Faq = lazy(() => import('../../Components/Home/Faq'));
const Hero6 = lazy(()=> import('../../Components/Home/Hero6'))
const Subscribe =lazy(()=> import('../../Components/Home/SubscribeCard2'))


import LoaderSample from '../../Components/Common/LoaderSample';

function Home() {

  return (
    <>
      <Suspense fallback={<LoaderSample/>}>
        <Hero />
        <VendorList />
        <Hero2 />
        <Hero3 />
       

        <div className='mt-40'>
          <Hero6/>
        </div>

        <Faq/>

        <div className='mt-40'>
          <Subscribe/>
        </div>

        <div className='mt-10'>
        <Footer />
        </div>
      </Suspense>
    </>
  );
}

export default Home;
