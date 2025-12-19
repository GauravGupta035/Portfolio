import { Box, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { Project } from "../../model";
import { projectList } from "../../initialListValues";
import ContentPanel from "../ContentPanel/ContentPanel";
import SidePanel from "../SidePanel/SidePanel";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const [projects] = useState<Project[]>(projectList);

  return (
    <div>
      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={0}
        align="flex-start"
        minH="100vh"
      >
        {/* Left Column - Side Panel */}
        <Box
          w={{ base: "100%", lg: "35%" }}
          position={{ base: "relative", lg: "sticky" }}
          top={0}
          h={{ base: "auto", lg: "100vh" }}
          style={{ zIndex: 10 }}
        >
          <SidePanel />
        </Box>

        {/* Right Column - Content Panel */}
        <Box
          w={{ base: "100%", lg: "65%" }}
          style={{ zIndex: 10 }}
        >
          <ContentPanel projects={projects} />
        </Box>
      </Stack>

      {/* Animated Background */}
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

export default LandingPage;