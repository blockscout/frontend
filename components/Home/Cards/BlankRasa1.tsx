/* eslint-disable max-len */
import { useColorMode } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

const BlankRasa1 = () => {
  const { colorMode } = useColorMode();

  return (
    <div className={ colorMode === 'light' ? 'w-full md:w-[35%] bg-white shadow-md rounded-xl p-5 mt-7 shadow-[#eeeeee] border border-[#fcfcfc] text-black' : 'w-full md:w-[35%] bg-[#171717] shadow-lg rounded-xl p-5 mt-7 shadow-[#0e2119] border border-none text-white' }>
      <Image src="/static/logo2.png" width={ 300 } height={ 300 } alt="logo2" className={ colorMode === 'light' ? 'w-[100px]' : 'w-[100px] invert' } priority/>
      <h2 className="pt-3 pb-2 text-xl 2xl:text-3xl font-[600]">Blank Rasa</h2>
      <p className="md:text-sm text-sm 2xl:text-xl">
      A platform for discovering and trading NFTs on Canto.
      Features collections such as CantoLongneck, Shnoises and more
      </p>
      <div>
        <a className="block mt-2" href="https://www.blankrasa.com" target="_blank" referrerPolicy="no-referrer">
          <button className={ colorMode === 'light' ? 'rounded-md text-base p-2 border border-[#12f27e] text-[#1bc06a] font-[600] w-full hover:bg-[#000] hover:text-[#fff] transition-all duration-300 hover:border-[#000]' : 'rounded-md text-base p-2 border border-[#12f27e] text-[#1bc06a] font-[600] w-full hover:bg-[#fff] hover:text-[#000] transition-all duration-300 hover:border-[#fff]' }>Explore More</button>
        </a>
      </div>
    </div>
  );
};

export default BlankRasa1;
