"use client";

import PageContainer from '../../components/PageContainer';
import ChessBoard from '../../components/ChessBoard';

export default function AnalysisPage() {
  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto mt-8">
        <ChessBoard 
          isPlayable={true} 
          playerColor="white"
          isAnalysisMode={true}
        />
      </div>
    </PageContainer>
  );
}
