import { useRouter } from "next/router";
import React from "react";

import useApiQuery from "lib/api/useApiQuery";
import { useAppContext } from "lib/contexts/app";
import { formatAmount } from "lib/utils/helpers";
import DHCDetails from "ui/dhc/DHCDetails";
import DHCStatistic from "ui/dhc/DHCStatistic";
import PageTitle from "ui/shared/Page/PageTitle";

const HDCContext: React.FC = ({}) => {
  const appProps = useAppContext();
  const router = useRouter();
  const providerID = router.query.id;

  const { data, isLoading } = useApiQuery("provider_details", {
    queryParams: {
      providerId: providerID,
    },
  });

  const backLink = React.useMemo(() => {
    const hasGoBackLink =
      appProps.referrer && appProps.referrer.includes("/dhcs");

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: "Back to HDC list",
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);
  return (
    <div style={{ width: "100%" }}>
      <PageTitle title="DHC details" withTextAd backLink={ backLink }/>
      { providerID && (
        <DHCDetails
          providerID={ providerID as string }
          providerDetails={ data }
          isLoading={ isLoading }
        />
      ) }
      { providerID && (
        <DHCStatistic
          providerID={ providerID as string }
          totalPunish={ formatAmount(data?.totalPunish ?? "0") }
          totalReward={ formatAmount(data?.totalReward ?? "0") }
          isLoaded={ true }
        />
      ) }
    </div>
  );
};

export default HDCContext;
