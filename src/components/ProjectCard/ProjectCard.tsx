import { Box, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";
import { Project } from "../../model";
import "./ProjectCard.css";

interface Props {
    project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
    return (
        <Link
            href={project.link.href}
            isExternal
            style={{ textDecoration: "none" }}
            w='100%'
        >
            <Box
                className='project-card'
                minH='200px'
                w='100%'
                maxW={{ lg: '600px' }}
                color='white'
                borderRadius='md'
                p={{ base: "5", md: "6", lg: "8" }}
                transition='all 0.3s'
                _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'lg'
                }}
            >
                <Heading 
                    mb='3' 
                    className='project-name'
                    fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                >
                    {project.name}
                </Heading>
                <Text
                    fontSize={{ base: "2xs", md: "xs" }}
                    letterSpacing={2}
                    mb='4'
                    className='project-stack'
                    textTransform='uppercase'
                >
                    {project.stack}
                </Text>
                <Text 
                    color='gray.400'
                    fontSize={{ base: "sm", md: "md" }}
                >
                    {project.description}
                </Text>
            </Box>
        </Link>
    );
};

export default ProjectCard;
