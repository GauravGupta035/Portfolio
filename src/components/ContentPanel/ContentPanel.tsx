import { Box, Button, Grid, GridItem, Image } from "@chakra-ui/react";
import React from "react";
import { Project, Skill } from "../../model";
import ProjectCard from "../ProjectCard/ProjectCard";
import SkillCard from "../SkillCard/SkillCard";
import "./ContentPanel.css";

interface Props {
	projects: Project[];
	skillGrp1: Skill[];
	skillGrp2: Skill[];
	skillGrp3: Skill[];
}

const handleButtonClick = () => {
	fetch("GauravGupta-Resume.pdf").then((response) => {
		response.blob().then((blob) => {
			const fileURL = window.URL.createObjectURL(blob);

			let alink = document.createElement("a");
			alink.href = fileURL;
			alink.download = "GauravGupta-Resume.pdf";
			alink.click();
		});
	});
};

const ContentPanel: React.FC<Props> = ({
	projects,
	skillGrp1,
	skillGrp2,
	skillGrp3,
}) => {
	return (
		<Box className='content-panel' pt='100px'>
			<div id='projects'>
				{projects.map((project) => (
					<ProjectCard project={project} key={project.id} />
				))}
			</div>
			<div id='skills' style={{ marginLeft: "35px", marginTop: "20px" }}>
				<Grid templateColumns='repeat(3, 1fr)' w='40vw'>
					<GridItem>
						{skillGrp1.map((skill) => (
							<SkillCard key={skill.id} skill={skill} />
						))}
					</GridItem>

					<GridItem mt='50px'>
						{skillGrp2.map((skill) => (
							<SkillCard key={skill.id} skill={skill} />
						))}
					</GridItem>

					<GridItem>
						{skillGrp3.map((skill) => (
							<SkillCard key={skill.id} skill={skill} />
						))}
					</GridItem>
				</Grid>
			</div>
			<div id='resume'>
				<Image alt='Gaurav Gupta Resume' src='#' />
				<Button onClick={handleButtonClick}>Download Resume</Button>
			</div>
		</Box>
	);
};

export default ContentPanel;