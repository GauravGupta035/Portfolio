import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react";
import { FaBriefcase } from "react-icons/fa";
import { experiences } from "../../initialListValues";

import "./ExperienceSection.css";

const ExperienceSection: React.FC = () => {
  return (
    <Box w="100%" mb={{ base: "12", md: "16" }}>
      <Heading
        as="h2"
        size={{ base: "lg", md: "xl" }}
        color="white"
        mb={{ base: "6", md: "8" }}
        display="flex"
        alignItems="center"
        gap={3}
      >
        <Icon as={FaBriefcase} color="#48bb78" />
        Experience
      </Heading>

      <VStack spacing={{ base: "8", md: "10" }} align="stretch">
        {experiences.map((exp, index) => (
          <Box
            key={index}
            className="experience-card"
            p={{ base: "5", md: "6", lg: "7" }}
            borderRadius="lg"
            borderLeft="3px solid"
            borderColor="#48bb78"
            position="relative"
            _hover={{
              transform: "translateX(4px)",
              boxShadow: "rgba(72, 187, 120, 0.15) 0px 4px 24px",
            }}
            transition="all 0.3s"
          >
            {/* Job Title */}
            <Heading
              as="h3"
              size={{ base: "md", md: "lg" }}
              color="white"
              mb={2}
            >
              {exp.title}
            </Heading>

            {/* Company and Period */}
            <HStack
              spacing={3}
              mb={4}
              flexWrap="wrap"
              fontSize={{ base: "sm", md: "md" }}
            >
              <Text color="#48bb78" fontWeight="semibold">
                {exp.company}
              </Text>
              <Text color="gray.500">•</Text>
              <Text color="gray.500">{exp.period}</Text>
            </HStack>

            {/* Achievements */}
            <VStack align="stretch" spacing={3}>
              {exp.achievements.map((achievement, idx) => (
                <HStack key={idx} align="flex-start" spacing={3}>
                  <Text color="#48bb78" mt={1} flexShrink={0}>
                    ▹
                  </Text>
                  <Text
                    as="span"
                    color="gray.400"
                    fontSize={{ base: "sm", md: "md" }}
                    lineHeight="1.7"
                  >
                    {achievement.includes(
                      "Recognized with SPOT Award as Customer Delight Champion"
                    ) ? (
                      <>
                        {achievement.replace(
                          "Recognized with SPOT Award as Customer Delight Champion",
                          ""
                        )}
                        <span className="spot-award">
                          Recognized with SPOT Award as Customer Delight Champion
                        </span>
                      </>
                    ) : (
                      achievement
                    )}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ExperienceSection;