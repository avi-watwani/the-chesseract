"use client";

import PageContainer from '../../components/PageContainer';
import ChessBoard from '../../components/ChessBoard';

export default function AnalysisPage() {
  return (
    <PageContainer>
      <ChessBoard 
        isPlayable={true} 
        playerColor="white"
        isAnalysisMode={true}
      />
    </PageContainer>
  );
}
