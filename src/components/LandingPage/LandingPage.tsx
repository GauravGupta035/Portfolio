import { Box, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { Project, Skill } from "../../model";
import {
	projectList,
	skillList1,
	skillList2,
	skillList3,
} from "../../initialListValues";
import ContentPanel from "../ContentPanel/ContentPanel";
import SidePanel from "../SidePanel/SidePanel";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
	const [projects] = useState<Project[]>(projectList);
	const [skillGrp1] = useState<Skill[]>(skillList1);
	const [skillGrp2] = useState<Skill[]>(skillList2);
	const [skillGrp3] = useState<Skill[]>(skillList3);

	return (
		<div>
			<SimpleGrid
				// templateColumns='repeat(2, 1fr)'
				minChildWidth='600px'
				gap={6}
				alignItems='center'
				height='auto'
			>
				<Box w='100%'>
					<div style={{ zIndex: 10 }}>
						<SidePanel />
					</div>
				</Box>
				<Box w='100%'>
					<div style={{ zIndex: 10 }}>
						<ContentPanel
							projects={projects}
							skillGrp1={skillGrp1}
							skillGrp2={skillGrp2}
							skillGrp3={skillGrp3}
						/>
					</div>
				</Box>
			</SimpleGrid>
			<ul className='circles'>
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
