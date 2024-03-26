import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

import type { Props } from "nextjs/getServerSideProps";
import PageNextJs from "nextjs/PageNextJs";

const Validator = dynamic(() => import("ui/pages/Validator"), {
  ssr: false,
});

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/validators/[hash]" query={ props }>
      <Validator/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from "nextjs/getServerSideProps";
