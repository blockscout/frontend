/* eslint-disable max-len */
import { useColorMode } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

const BlankRasa1 = () => {
  const { colorMode } = useColorMode();

  return (
    <div className={ colorMode === 'light' ? 'w-full md:w-[35%] bg-white shadow-md rounded-xl p-5 mt-7 shadow-[#eeeeee] border border-[#fcfcfc] text-black' : 'w-full md:w-[35%] bg-[#171717] shadow-lg rounded-xl p-5 mt-7 shadow-[#0e2119] border border-none text-white' }>
      <Image src="/static/logo2.png" width={ 300 } height={ 300 } alt="logo2" className={ colorMode === 'light' ? 'w-[100px]' : 'w-[100px] invert' } priority/>
      <h2 className="pt-3 pb-2 text-xl 2xl:text-2xl font-[600]">Blank Rasa</h2>
      <p className={ colorMode === 'light' ? 'md:text-sm text-sm 2xl:text-base text-[#616B74]' : 'md:text-sm text-sm 2xl:text-xl text-[#f2f2f2]' }>
      A platform for discovering and trading NFTs on Canto.
      Features collections such as CantoLongneck, Shnoises and more
      </p>
      <div>
        <a className="block mt-2" href="https://www.blankrasa.com" target="_blank" referrerPolicy="no-referrer">
          <button className={ colorMode === 'light' ? 'rounded-md text-base p-2 border border-[#3CAD71] text-[#3CAD71] font-[500] w-full hover:bg-[#3CAD71] hover:text-[#fff] transition-all duration-300 hover:border-[#3CAD71]' : 'rounded-md text-base p-2 border border-[#3CAD71] text-[#3CAD71]  font-[500] w-full hover:bg-[#3CAD71] hover:text-[#000] transition-all duration-300 hover:border-[#3CAD71]' }>Explore More</button>
        </a>
      </div>
    </div>
  );
};

export default BlankRasa1;
