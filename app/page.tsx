import { OrchestratorAgent, AgentSystemInput } from '@/agents/orchestrator'; // Adjust path if needed
import { AgentSystemOutput } from '@/agents/types'; // Adjust path if needed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import React from 'react'; // Import React

// Basic component to render the generated content (can be significantly enhanced)
function RenderContent({ output }: { output: AgentSystemOutput | null }) {
  if (!output) {
    return <p className="text-muted-foreground">Enter a query above to generate content.</p>;
  }

  const { queryAnalysis, mainContent, generationMetadata } = output;

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>{mainContent.seoTitle}</CardTitle>
        <CardDescription>{mainContent.metaDescription}</CardDescription>
        <div className="flex flex-wrap gap-1 pt-2">
          {mainContent.keywords.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-2 text-lg">Query Analysis</h3>
        <p><span className="font-medium">Intent:</span> {queryAnalysis.intent}</p>
        <p><span className="font-medium">Key Topics:</span> {queryAnalysis.keyTopics.join(', ')}</p>

        <Separator className="my-4" />

        <h3 className="font-semibold mb-2 text-lg">Generated Content Outline</h3>
        <ul className="list-disc list-inside mb-4 text-sm text-muted-foreground">
          {mainContent.contentOutline.map((item, index) => <li key={index}>{item}</li>)}
        </ul>

        {/* Render main body - needs proper markdown/HTML parsing in a real app */}
        <h3 className="font-semibold mb-2 text-lg">Content Body (Draft)</h3>
        <div className="prose prose-sm max-w-none dark:prose-invert bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
          {mainContent.body}
        </div>


        {mainContent.interactiveElements && mainContent.interactiveElements.length > 0 && (
          <>
            <Separator className="my-4" />
            <h3 className="font-semibold mb-2 text-lg">Interactive Elements</h3>
            <ul className="list-disc list-inside text-sm">
              {mainContent.interactiveElements.map((el, i) => <li key={i}>{el.type} ({el.topic || el.id})</li>)}
            </ul>
          </>
        )}

        <Separator className="my-4" />

        <h3 className="font-semibold mb-2 text-lg">Trust & Transparency</h3>
         <div className="space-y-2 text-sm">
            <div>
                <h4 className="font-medium">Trust Signals:</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                    {mainContent.trustSignals.map((signal, i) => <li key={i}>{signal}</li>)}
                </ul>
            </div>
             <div>
                <h4 className="font-medium">Citations:</h4>
                 <ul className="list-disc list-inside text-muted-foreground">
                    {mainContent.citations.map((cite, i) => <li key={i}>{cite.description} (Source: {cite.source})</li>)}
                </ul>
            </div>
             <div>
                <h4 className="font-medium">Disclaimers:</h4>
                 <ul className="list-disc list-inside text-muted-foreground">
                    {mainContent.disclaimers.map((disc, i) => <li key={i}>{disc}</li>)}
                </ul>
            </div>
         </div>


      </CardContent>
      <CardFooter className="text-xs text-muted-foreground justify-between">
        <span>Generated by: {generationMetadata.agentsInvolved.join(', ')}</span>
        <span>Processing Time: {generationMetadata.processingTimeMs}ms</span>
        <span>Updated: {new Date(mainContent.lastUpdated).toLocaleString()}</span>
      </CardFooter>
    </Card>
  );
}


export default function Home() {
  const [query, setQuery] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [output, setOutput] = React.useState<AgentSystemOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    if (!query.trim()) {
      setError("Please enter a query.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput(null);

    try {
      // NOTE: In a real Next.js app, you'd likely call an API route
      // that runs the agent logic on the server-side.
      // Running complex logic directly in the client component is not ideal.
      // This is simplified for demonstration within this environment.
      const orchestrator = new OrchestratorAgent();
      const input: AgentSystemInput = { userQuery: query };
      const result = await orchestrator.process(input);
      setOutput(result);
    } catch (err: any) {
      console.error("Error generating content:", err);
      setError(`Failed to generate content: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">AI Trading Content Generator</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-xl">
        Enter a search query related to learning financial market trading.
        The AI agent system will generate trustworthy, engaging, and SEO-optimized content.
      </p>

      <div className="w-full max-w-lg flex gap-2 items-end">
        <div className="flex-grow">
          <Label htmlFor="searchQuery">Search Query</Label>
          <Input
            id="searchQuery"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., how to start day trading"
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Content'}
        </Button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <RenderContent output={output} />

    </div>
  );
}
