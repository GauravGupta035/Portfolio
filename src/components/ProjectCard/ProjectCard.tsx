import { Box, Heading, Link, Text, HStack, Icon } from "@chakra-ui/react";
import React from "react";
import { Project } from "../../model";
import { FiExternalLink } from "react-icons/fi";
import "./ProjectCard.css";

interface Props {
    project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
    return (
        <Box
            className='project-card'
            w='100%'
            color='white'
            borderRadius='lg'
            p={{ base: "5", md: "6", lg: "7" }}
            transition='all 0.3s'
            borderLeft="3px solid"
            borderColor="#48bb78"
            _hover={{
                transform: 'translateX(4px)',
                boxShadow: "rgba(72, 187, 120, 0.15) 0px 4px 24px",
            }}
        >
            <HStack justify="space-between" align="flex-start" mb={3}>
                <Heading 
                    className='project-name'
                    fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                    flex={1}
                >
                    {project.name}
                </Heading>
                <Link
                    href={project.link.href}
                    isExternal
                    color="gray.400"
                    _hover={{ color: "#48bb78" }}
                    transition="all 0.2s"
                >
                    <Icon as={FiExternalLink} boxSize={{ base: 5, md: 6 }} />
                </Link>
            </HStack>

            <Text
                fontSize={{ base: "2xs", md: "xs" }}
                letterSpacing={2}
                mb='4'
                className='project-stack'
                textTransform='uppercase'
                color="#48bb78"
            >
                {project.stack}
            </Text>

            <Text 
                color='gray.400'
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.7"
            >
                {project.description}
            </Text>
        </Box>
    );
};

export default ProjectCard;