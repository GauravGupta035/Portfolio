import {
    Box,
    Button,
    Grid,
    GridItem,
    Image,
    Text,
    Link,
    VStack,
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
        <Box 
            className='content-panel' 
            pt={{ base: "8", md: "16", lg: "20" }}
            px={{ base: "6", md: "8", lg: "10" }}
            pb='10'
            w='100%'
        >
            {/* Projects Section */}
            <VStack spacing={4} w='100%' id='projects'>
                {projects.map((project) => (
                    <ProjectCard project={project} key={project.id} />
                ))}
            </VStack>

            {/* Skills Section */}
            <Box mt='10' w='100%'>
                <Grid
                    templateColumns={{ 
                        base: '1fr',
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)'
                    }}
                    gap={{ base: 4, md: 6 }}
                    w='100%'
                >
                    <GridItem>
                        {skillGrp1.map((skill) => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))}
                    </GridItem>

                    <GridItem mt={{ base: 0, lg: '50px' }}>
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
            </Box>

            {/* Resume Section */}
            <VStack
                id='resume'
                spacing={5}
                align='center'
                w='100%'
                mt='10'
				px={{ base: 4, md: 6 }}
            >
                <Image
                    alt='Gaurav_Alok_Gupta_Resume'
                    src={process.env.PUBLIC_URL + "/images/portfolio-resume.png"}
                    w={{ base: '100%', md: '80%', lg: '60%' }}
                    h='auto'
                    objectFit='contain'
                />
                <Button
                    onClick={handleButtonClick}
                    maxW='200px'
                    bgColor='white'
                    color='black'
                    _hover={{ color: "white", bgColor: "#151515" }}
                >
                    Download Resume
                </Button>
            </VStack>

            {/* Credits */}
            <Box id='credits' mt='10'>
                <Text
                    color='gray.400'
                    fontSize={{ base: 'xs', md: 'sm' }}
                    textAlign='center'
                    px={4}
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
            </Box>
        </Box>
    );
};

export default ContentPanel;
