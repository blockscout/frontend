import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import type { StakeValidatorInfo } from "types/api/boolscan";

import useBoolRpcApi from "lib/api/useBoolRpcApi";
import { useAppContext } from "lib/contexts/app";
import AddressEntity from "ui/shared/entities/address/AddressEntity";
import PageTitle from "ui/shared/Page/PageTitle";
import ValidatorDetails from "ui/validator/ValidatorDetails";
import ValidatorStatistic from "ui/validator/ValidatorStatistic";

const ValidatorContext: React.FC = ({}) => {
  const appProps = useAppContext();
  const router = useRouter();
  const validatorAddress = router.query.hash as string;

  const backLink = React.useMemo(() => {
    const hasGoBackLink =
      appProps.referrer && appProps.referrer.includes("/validators");

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: "Back to validator list",
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const rpcRes = useBoolRpcApi("staking_validatorInfo", {
    queryParams: [ [ validatorAddress ] ],
  });

  const validatorInfo = React.useMemo<StakeValidatorInfo | undefined>(() => {
    return rpcRes.data?.[0];
  }, [ rpcRes.data ]);

  return (
    <div style={{ width: "100%" }}>
      <PageTitle title="Validator details" withTextAd backLink={ backLink }/>
      <Flex
        alignItems="center"
        w="100%"
        columnGap={ 2 }
        rowGap={ 2 }
        paddingBottom="20px"
        flexWrap={{ base: "wrap", lg: "nowrap" }}
      >
        <AddressEntity
          address={{
            hash: validatorAddress,
            name: "",
            ens_domain_name: "",
          }}
          fontFamily="heading"
          fontSize="lg"
          fontWeight={ 500 }
          noLink
          mr={ 4 }
        />
      </Flex>
      { validatorAddress && (
        <ValidatorDetails
          address={ validatorAddress as string }
          validator={ validatorInfo }
          loading={ rpcRes.isLoading }
        />
      ) }
      { validatorAddress && (
        <ValidatorStatistic address={ validatorAddress as string }/>
      ) }
    </div>
  );
};

export default ValidatorContext;
