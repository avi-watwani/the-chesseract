"use client";

import PageContainer from '../../components/PageContainer';
import ChessBoard from '../../components/ChessBoard';

export default function AnalysisPage() {
  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Analysis</h1>
        <ChessBoard isPlayable={false} />
      </div>
    </PageContainer>
  );
}
