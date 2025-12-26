import {
  Box,
  Heading,
  VStack,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { Project } from "../../model";
import ProjectCard from "../ProjectCard/ProjectCard";
import ExperienceSection from "../ExperienceSection/ExperienceSection";
import SkillsSection from "../SkillsSection/SkillsSection";
import { FaFolder } from "react-icons/fa";
import "./ContentPanel.css";

interface Props {
  projects: Project[];
  skillGrp1?: any[];
  skillGrp2?: any[];
  skillGrp3?: any[];
}

const ContentPanel: React.FC<Props> = ({ projects }) => {
  return (
    <Box
      className="content-panel"
      pt={{ base: "8", md: "16", lg: "20" }}
      pb="10"
      w="100%"
    >
      {/* Centered container with max width for all sections */}
      <Box 
        maxW="900px" 
        mx="auto"
        px={{ base: "6", md: "8", lg: "10" }}
      >
        {/* Experience Section */}
        <ExperienceSection />

        {/* Projects Section */}
        <Box w="100%" mb={{ base: "12", md: "16" }}>
          <Heading
            as="h2"
            size={{ base: "lg", md: "xl" }}
            color="white"
            mb={{ base: "6", md: "8" }}
            display="flex"
            alignItems="center"
            gap={3}
          >
            <Icon as={FaFolder} color="#48bb78" />
            Projects
          </Heading>

          <VStack spacing={{ base: 4, md: 5 }} w="100%" id="projects">
            {projects.map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
          </VStack>
        </Box>

        {/* Skills Section */}
        <SkillsSection />
      </Box>
    </Box>
  );
};

export default ContentPanel;