"use client";
import { useState } from "react";
import { getEmojiForClass } from "~/lib/utils";

import { ColorScale } from "~/components/color-scale";
import { FeatureMap } from "~/components/feature-map";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Waveform } from "~/components/waveform";

type Prediction = {
  class: string;
  confidence: number;
};

type LayerData = {
  shape: number[];
  values: number[][];
};

type VisualizationData = Record<string, LayerData>;

type WaveFormData = {
  values: number[];
  sample_rate: number;
  duration: number;
};

type ApiResponse = {
  predictions: Prediction[];
  visualization: VisualizationData;
  input_spectogram: LayerData;
  waveform: WaveFormData;
};

function splitLayers(visualization: VisualizationData) {
  const main: [string, LayerData][] = [];
  const internals: Record<string, [string, LayerData][]> = {};

  for (const [name, data] of Object.entries(visualization)) {
    if (!name.includes(".")) {
      main.push([name, data]);
    } else {
      const [parent] = name.split(".");
      if (parent === undefined) continue;

      if (!internals[parent]) internals[parent] = [];
      internals[parent].push([name, data]);
    }
  }

  return { main, internals };
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<ApiResponse | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    setData(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );

        const response = await fetch(
          "https://facundo-martin--audio-cnn-inference-audioclassifier-inference.modal.run",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio_data: base64String }),
          },
        );

        if (!response.ok) {
          throw new Error(`API error ${response.statusText}`);
        }

        const data = (await response.json()) as ApiResponse;
        setData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file");
      setIsLoading(false);
    };
  }

  const { main, internals } = data
    ? splitLayers(data?.visualization)
    : { main: [], internals: {} };

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-[60%]">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-light tracking-tight text-stone-900">
            CNN Audio Visualizer
          </h1>
          <p className="text-md mb-8 text-stone-600">
            Upload a WAV file to see the model&apos;s predictions and feauture
            maps
          </p>

          <div className="flex flex-col items-center">
            <div className="relative inline-block">
              <input
                type="file"
                accept=".wav"
                id="file-upload"
                disabled={isLoading}
                onChange={handleFileChange}
                className="absolute inset-0 w-full cursor-pointer opacity-0"
              />
              <Button
                disabled={isLoading}
                className="border-stone-300"
                variant="outline"
                size="lg"
              >
                {isLoading ? "Analyzing..." : "Choose File"}
              </Button>
            </div>
          </div>

          {fileName && (
            <Badge
              variant="secondary"
              className="mt-4 bg-stone-200 text-stone-700"
            >
              {fileName}
            </Badge>
          )}
        </div>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent>
              <p className="text-red-600">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-stone-900">
                  Top Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.predictions.slice(0, 3).map((pred, i) => (
                    <div key={pred.class} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-md font-medium text-stone-700">
                          {getEmojiForClass(pred.class)}{" "}
                          <span className="ml-0.5">
                            {pred.class.replaceAll("_", "")}
                          </span>
                        </div>
                        <Badge variant={i === 0 ? "default" : "secondary"}>
                          {(pred.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={pred.confidence * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-stone-900">
                    Input Spectrogram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FeatureMap
                    data={data.input_spectogram.values}
                    title={`${data.input_spectogram.shape.join(" x ")}`}
                    isSpectogram
                  />
                  <div className="mt-5 flex justify-end">
                    <ColorScale width={200} height={16} min={-1} max={1} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-stone-900">
                    Audio Waveform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Waveform
                    data={data.waveform.values}
                    title={`${data.waveform.duration.toFixed(2)}s * ${data.waveform.sample_rate}Hz`}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Convolutional Layer Outputs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-6">
                  {main.map(([mainName, mainData]) => (
                    <div key={mainName} className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-medium text-stone-700">
                          {mainName}
                        </h4>
                        <FeatureMap
                          data={mainData.values}
                          title={`${mainData.shape.join(" x ")}`}
                        />
                      </div>

                      {internals[mainName] && (
                        <div className="h-80 overflow-y-auto rounded border border-stone-200 bg-stone-50 p-2">
                          <div className="space-y-2">
                            {internals[mainName]
                              .sort(([a], [b]) => a.localeCompare(b))
                              .map(([layerName, layerData]) => (
                                <FeatureMap
                                  key={layerName}
                                  data={layerData.values}
                                  title={layerName.replace(`${mainName}.`, "")}
                                  isInternal
                                />
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <ColorScale width={200} height={16} min={-1} max={1} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
