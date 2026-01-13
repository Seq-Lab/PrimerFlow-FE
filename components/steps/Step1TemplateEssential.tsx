"use client";

import { ChangeEvent, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

type HelperTone = "muted" | "success" | "error";

const appendSequence = (current: string, addition: string) => {
    const normalized = addition.replace(/\r\n/g, "\n");
    if (!normalized.trim()) {
        return current;
    }
    if (!current.trim()) {
        return normalized;
    }
    return `${current.trimEnd()}\n${normalized}`;
};

const countBasePairs = (sequence: string) =>
    sequence.replace(/^>.*$/gm, "").replace(/\s+/g, "").length;

export default function Step1TemplateEssential() {
    const [sequenceInput, setSequenceInput] = useState("");
    const [helper, setHelper] = useState<{ text: string; tone: HelperTone }>({
        text: "FASTA 파일을 업로드하거나 클립보드에서 붙여넣을 수 있습니다.",
        tone: "muted",
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const bpLength = countBasePairs(sequenceInput);

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const content = await file.text();
            if (!content.trim()) {
                setHelper({ text: "선택한 파일에 내용이 없습니다.", tone: "muted" });
                return;
            }
            setSequenceInput((prev) => appendSequence(prev, content));
            setHelper({ text: `${file.name}을(를) 추가했습니다.`, tone: "success" });
        } catch (error) {
            console.error(error);
            setHelper({
                text: "파일을 읽는 중 문제가 발생했습니다. 다시 시도해주세요.",
                tone: "error",
            });
        } finally {
            event.target.value = "";
        }
    };

    const handlePaste = async () => {
        try {
            const pasted = await navigator.clipboard.readText();
            if (!pasted.trim()) {
                setHelper({ text: "클립보드에 텍스트가 없습니다.", tone: "muted" });
                return;
            }
            setSequenceInput((prev) => appendSequence(prev, pasted));
            setHelper({ text: "클립보드 내용을 추가했습니다.", tone: "success" });
        } catch (error) {
            console.error(error);
            setHelper({
                text: "클립보드 접근이 차단되었습니다. 브라우저 설정을 확인하세요.",
                tone: "error",
            });
        }
    };

    const handleClean = () => {
        setSequenceInput("");
        setHelper({ text: "입력을 초기화했습니다.", tone: "muted" });
    };

    const helperToneClass: Record<HelperTone, string> = {
        muted: "text-slate-500",
        success: "text-emerald-400",
        error: "text-rose-400",
    };

    return (
        <section className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-base font-bold text-slate-300">
                Step 1. 템플릿 시퀀스와 기본 설정을 입력하세요.
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
                <div className="flex flex-col rounded-xl border border-slate-800/70 bg-slate-900/70 overflow-hidden shadow-lg shadow-black/20">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161920]">
                        <div className="flex items-center gap-2">
                            <h3 className="text-white text-lg font-bold">PCR Template Sequence</h3>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            FASTA / Raw
                        </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col gap-4">
                        <label className="flex flex-col flex-1 h-full">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-medium text-slate-400">
                                    Sequence Input (5&apos; -&gt; 3&apos;)
                                </span>
                                <span className="text-xs text-slate-500 font-mono">{bpLength} bp</span>
                            </div>
                            <div className="relative flex-1">
                                <TextareaAutosize
                                    className="w-full min-h-[200px] resize-none overflow-y-auto rounded-lg border border-slate-800 bg-[#0b1224] text-white p-4 font-mono text-sm leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-600 transition-colors"
                                    placeholder={">Seq1\nATGCGT..."}
                                    spellCheck={false}
                                    minRows={10}
                                    maxRows={20}
                                    value={sequenceInput}
                                    onChange={(event) => setSequenceInput(event.target.value)}
                                />
                            </div>
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            {helper.text && (
                                <span
                                    className={`text-xs ${helperToneClass[helper.tone]}`}
                                    aria-live="polite"
                                >
                                    {helper.text}
                                </span>
                            )}
                            <div className="flex flex-wrap gap-2 ml-auto">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".fa,.fasta,.txt"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <button
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Upload FASTA
                                </button>
                                <button
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                                    type="button"
                                    onClick={handlePaste}
                                >
                                    Paste
                                </button>
                                <button
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                                    type="button"
                                    onClick={handleClean}
                                >
                                    Clean
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm backdrop-blur">
                        <div className="px-5 py-3 border-b border-slate-800 bg-[#161920]/50 flex items-center gap-2">
                            <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
                            <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                                Essential Settings
                            </h3>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                    Target Organism (Database)
                                </label>
                                <div className="relative">
                                    <select className="w-full appearance-none bg-[#0b1224] border border-slate-800 rounded-lg py-2 pl-3 pr-10 text-white text-sm focus:border-blue-500 focus:ring-0">
                                        <option value="human">Homo sapiens (Human) - hg38</option>
                                        <option value="mouse">Mus musculus (Mouse) - mm10</option>
                                        <option value="rat">Rattus norvegicus (Rat) - rn6</option>
                                        <option value="custom">Custom Database...</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                        v
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                    PCR Product Size (bp)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                        placeholder="Min"
                                        type="number"
                                        defaultValue={100}
                                    />
                                    <span className="text-slate-500">-</span>
                                    <input
                                        className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                        placeholder="Max"
                                        type="number"
                                        defaultValue={300}
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                    Primer Tm (C)
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        {
                                            label: "Min",
                                            value: 57.0,
                                            tone: "text-slate-200",
                                            border: "border-slate-800",
                                        },
                                        {
                                            label: "Opt",
                                            value: 60.0,
                                            tone: "text-blue-100",
                                            border: "border-blue-500/50",
                                        },
                                        {
                                            label: "Max",
                                            value: 63.0,
                                            tone: "text-slate-200",
                                            border: "border-slate-800",
                                        },
                                    ].map((item) => (
                                        <div key={item.label} className="relative">
                                            <span
                                                className={`absolute top-[-1.2em] left-0 text-[10px] ${
                                                    item.label === "Opt"
                                                        ? "text-primary font-bold"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {item.label}
                                            </span>
                                            <input
                                                className={`w-full bg-[#0b1224] border ${item.border} rounded-lg py-2 px-3 text-sm ${item.tone} focus:border-blue-500 focus:ring-0`}
                                                type="number"
                                                defaultValue={item.value}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
