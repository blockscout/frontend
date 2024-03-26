import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

import type { Props } from "nextjs/getServerSideProps";
import PageNextJs from "nextjs/PageNextJs";

const DHC = dynamic(() => import("ui/pages/DHC"), {
  ssr: false,
});

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/dhcs/[id]" query={ props }>
      <DHC/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from "nextjs/getServerSideProps";
