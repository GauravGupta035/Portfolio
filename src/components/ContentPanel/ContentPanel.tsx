import {
	Box,
	Button,
	Grid,
	GridItem,
	Image,
	Text,
	Link,
} from "@chakra-ui/react";
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
	fetch(process.env.PUBLIC_URL + "/Gaurav_Alok_Gupta_Resume.pdf").then((response) => {
		response.blob().then((blob) => {
			const fileURL = window.URL.createObjectURL(blob);

			let alink = document.createElement("a");
			alink.href = fileURL;
			alink.download = "Gaurav_Alok_Gupta_Resume.pdf";
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
			<Box mt='20px'>
				<Grid
					templateColumns='repeat(3, 1fr)'
					ml={{ base: "10vw", xl: "5vw", lg: "3.5vw" }}
					w={{ base: "40vw", xl: "40vw", lg: "42vw", md: "80vw", sm: "80vw" }}
				>
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
				{/* </div> */}
			</Box>
			<Box
				id='resume'
				display='flex'
				flexDirection='column'
				alignItems='center'
				w={{ base: "40vw", xl: "40vw", lg: "42vw", md: "80vw", sm: "80vw" }}
			>
				<Image
					alt='Gaurav_Alok_Gupta_Resume'
					src={process.env.PUBLIC_URL + "/images/portfolio-resume.png"}
					w='100%'
					h='50%'
					m='20px'
					ml={{ base: "10vw", xl: "10vw", lg: "8vw", md: "20vw", sm: "22vw" }}
				/>
				<Button
					onClick={handleButtonClick}
					maxW='200px'
					mb='20px'
					ml={{ base: "10vw", xl: "10vw", lg: "8vw", md: "20vw", sm: "22vw" }}
					bgColor='white'
					color='black'
					// className='resume'
					_hover={{ color: "white", bgColor: "#151515" }}
				>
					Download Resume
				</Button>
			</Box>
			<div id='credits'>
				<Text
					color='gray.400'
					fontSize='sm'
					mb='20px'
					ml={{ base: "17vw", xl: "17vw", lg: "16vw", md: "38vw", sm: "35vw" }}
				>
					Design inspired by{" "}
					<Link
						color='white'
						textDecoration='underline'
						href='https://dribbble.com/NicolasMzrd'
						isExternal
					>
						Nicolas Meuzard
					</Link>
					 {" "}and developed by{" "}
					<Link
						color='white'
						textDecoration='underline'
						href='https://github.com/GauravGupta035/'
						isExternal
					>
						Me
					</Link>
				</Text>
			</div>
		</Box>
	);
};

export default ContentPanel;
