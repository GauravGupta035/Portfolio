import { Grid, GridItem } from "@chakra-ui/react";
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
			<Grid
				templateColumns='repeat(2, 1fr)'
				gap={6}
				justifyItems='center'
				alignItems='center'
				height='100vh'
				className=''
			>
				<GridItem w='100%'>
					<div style={{ zIndex: 10 }}>
						<SidePanel />
					</div>
				</GridItem>
				<GridItem w='100%'>
					<div style={{ zIndex: 10 }}>
						<ContentPanel
							projects={projects}
							skillGrp1={skillGrp1}
							skillGrp2={skillGrp2}
							skillGrp3={skillGrp3}
						/>
					</div>
				</GridItem>
			</Grid>
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
