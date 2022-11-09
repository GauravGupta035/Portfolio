import { Box, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";
import { Project } from "../../model";
import "./ProjectCard.css";

interface Props {
	project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
	return (
		<Link href={project.link.href} isExternal>
			<Box
				className='project-card'
				height='200px'
				width='40vw'
				mb='15px'
				ml='35px'
				color='white'
				p={30}
			>
				<Heading mb='10px' className='project-name'>
					{project.name}
				</Heading>
				<Text fontSize='13px' letterSpacing={3} mb='20px'>
					{project.stack}
				</Text>
				<Text color='gray.400'>{project.description}</Text>
			</Box>
		</Link>
	);
};

export default ProjectCard;
