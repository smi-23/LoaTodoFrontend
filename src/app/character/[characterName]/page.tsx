"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { lostark_api } from "@/app/utils";
import { Box, Paper, Grid, Typography, styled, Container } from "@mui/material";

const InfoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3), // 패딩을 3으로 증가
  ...theme.typography.body2,
  textAlign: "center",
}));

const CharacterPage = () => {
  const { characterName } = useParams();
  const [characterData, setCharacterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCharacterInfo = async () => {
      if (characterName) {
        try {
          const response = await lostark_api().get(
            `armories/characters/${characterName}`,
          );
          const data = response.data;

          if (data) {
            setCharacterData(data);
          } else {
            // router.push("/404");
          }
        } catch (error) {
          console.error("Error fetching character data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCharacterInfo();
  }, [characterName, router]);

  return (
    <>
      {loading ? (
        <div>로딩 중...</div>
      ) : !characterData ? (
        <div>캐릭터 정보를 찾을 수 없습니다.</div>
      ) : (
        <Container sx={{ flexGrow: 1, p: 2, width: "100%" }}>
          <Grid>
            <Paper>
              <Typography variant="h5" gutterBottom>
                {characterData.ArmoryProfile?.CharacterName ||
                  "캐릭터 이름 없음"}
              </Typography>
            </Paper>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  캐릭터 이미지
                </Typography>
                {characterData.ArmoryProfile?.CharacterImage ? (
                  <img
                    src={characterData.ArmoryProfile.CharacterImage}
                    alt={
                      characterData.ArmoryProfile.CharacterName ||
                      "캐릭터 이미지"
                    }
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  <Typography>이미지 정보 없음</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {characterData.ArmoryProfile?.CharacterName ||
                    "캐릭터 이름 없음"}
                </Typography>
                <Typography>
                  레벨:{" "}
                  {characterData.ArmoryProfile?.CharacterLevel || "정보 없음"}
                </Typography>
                <Typography>
                  아이템 평균 레벨:{" "}
                  {characterData.ArmoryProfile?.ItemAvgLevel || "정보 없음"}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  장비
                </Typography>
                <ul>
                  {characterData.ArmoryEquipment?.map(
                    (item: any, index: number) => (
                      <li key={index}>{item.name}</li>
                    ),
                  ) || "장비 정보 없음"}
                </ul>
              </Paper>
              <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                  보석 정보
                </Typography>
              </Paper>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper elevation={3} sx={{ p: 3 }}>
                    특성 정보
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={3} sx={{ p: 3 }}>
                    각인 정보
                  </Paper>
                </Grid>
              </Grid>
              <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                카드 정보
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default CharacterPage;
