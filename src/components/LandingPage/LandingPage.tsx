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
			>
				<GridItem w='100%'>
					<SidePanel />
				</GridItem>
				<GridItem w='100%'>
					<ContentPanel
						projects={projects}
						skillGrp1={skillGrp1}
						skillGrp2={skillGrp2}
						skillGrp3={skillGrp3}
					/>
				</GridItem>
			</Grid>
		</div>
	);
};

export default LandingPage;
