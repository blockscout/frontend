import { Tag, TagLabel } from "@chakra-ui/react";
import React from "react";

import type { DHCStatus } from "types/api/boolscan";

const statusObj: { [key: string]: string } = {
  UnMount: "Not listed",
  TryQuit: "Exiting Service",
  Started: "Run",
  Join: "Service",
  Stopped: "Stop",
  Offline: "Offline",
};

const DHCStatusTag = ({ status }: { status?: DHCStatus | null }) => {
  const statusColors = {
    UnMount: {
      background: "rgba(154, 154, 154, 0.18)",
      color: "#595959",
    },
    TryQuit: {
      background: "rgba(255, 229, 143, 0.18)",
      color: "#faad14",
    },
    Started: {
      background: "rgba(117, 255, 177, 0.18)",
      color: "#52c41a",
    },
    Join: {
      background: "rgba(117, 255, 177, 0.18)",
      color: "#52c41a",
    },
    Stopped: {
      background: "rgba(255, 120, 117, 0.18)",
      color: "#ff4d4f",
    },
    Offline: {
      background: "rgba(255, 120, 117, 0.18)",
      color: "#ff4d4f",
    },
  };

  return (
    <>
      { }
      <Tag
        width="100px"
        size="lg"
        borderRadius="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgColor={ statusColors[status || "UnMount"].background }
      >
        <TagLabel color={ statusColors[status || "UnMount"].color }>
          { statusObj[status || "UnMount"] }
        </TagLabel>
      </Tag>
    </>
  );
};

export default DHCStatusTag;
