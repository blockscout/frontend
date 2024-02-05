/* eslint-disable max-len */
import { useColorMode } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

const BlankRasa2 = () => {
  const { colorMode } = useColorMode();

  return (
    <div className={ colorMode === 'light' ? 'w-full md:flex items-center bg-white shadow-md rounded-xl p-5 shadow-[#eeeeee] border border-[#fcfcfc] text-black' : 'w-full md:flex items-center bg-[#171717] shadow-lg rounded-xl p-5 shadow-[#0e2119] border border-none text-white' }>
      <div className="md:flex items-center md:gap-5">
        <Image src="/static/logo2.png" width={ 300 } height={ 300 } alt="logo2" className={ colorMode === 'light' ? 'w-[90px] 2xl:w-[120px]' : 'w-[90px] 2xl:w-[120px] invert' } priority/>
        <div className="md:w-[60%]">
          <h2 className="pt-3 pb-2 text-xl 2xl:text-2xl font-[600]">Blank Rasa</h2>
          <p className={ colorMode === 'light' ? 'text-sm 2xl:text-base text-[#616B74]' : 'text-sm 2xl:text-base text-[#f2f2f2]' }>
                A platform for discovering and trading NFTs on Canto.
                Features collections such as CantoLongneck, Shnoises and more
          </p>
        </div>
      </div>
      <div>
        <a className="block mt-2 md:w-[270px]" href="https://www.blankrasa.com" target="_blank" referrerPolicy="no-referrer">
          <button className={ colorMode === 'light' ? 'rounded-md text-sm p-[11px] border border-[#3CAD71] text-[#3CAD71] font-[400] w-full hover:bg-[#3CAD71] hover:text-[#fff] transition-all duration-300 hover:border-[#3CAD71]' : 'rounded-md text-sm p-[11px] border border-[#3CAD71] text-[#3CAD71] font-[400] w-full hover:bg-[#3CAD71] hover:text-[#000] transition-all duration-300 hover:border-[#3CAD71]' }>Explore More</button>
        </a>
      </div>
    </div>
  );
};

export default BlankRasa2;
