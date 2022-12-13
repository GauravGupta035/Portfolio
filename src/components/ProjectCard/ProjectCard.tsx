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
		>
			<Box
				className='project-card'
				height='200px'
				width={{ base: "40vw", xl: "40vw", lg: "42vw", md: "80vw", sm: "80vw" }}
				mb='15px'
				mx='auto'
				color='white'
				borderRadius='md'
				p={{ base: "30px", xl: "30px", lg: "20px", md: "30px", sm: "30px" }}
			>
				<Heading mb='10px' className='project-name'>
					{project.name}
				</Heading>
				<Text
					fontSize='13px'
					letterSpacing={3}
					mb='20px'
					className='project-stack'
				>
					{project.stack}
				</Text>
				<Text color='gray.400'>{project.description}</Text>
			</Box>
		</Link>
	);
};

export default ProjectCard;
