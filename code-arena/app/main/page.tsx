"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { ChevronDown, Filter, Search } from "lucide-react"
import { useState } from "react"
import Header from "@/components/home/header"

export default function ProblemsPage() {
  // Mock data for problems
  const problems = [
    { id: 1, title: "Two Sum", difficulty: "Easy", topics: ["Array", "Hash Table"], solved: true },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", topics: ["Linked List", "Math"], solved: true },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      topics: ["String", "Sliding Window"],
      solved: false,
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      topics: ["Array", "Binary Search"],
      solved: false,
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      topics: ["String", "Dynamic Programming"],
      solved: false,
    },
    { id: 6, title: "ZigZag Conversion", difficulty: "Medium", topics: ["String"], solved: false },
    { id: 7, title: "Reverse Integer", difficulty: "Medium", topics: ["Math"], solved: true },
    { id: 8, title: "String to Integer (atoi)", difficulty: "Medium", topics: ["String"], solved: false },
    { id: 9, title: "Palindrome Number", difficulty: "Easy", topics: ["Math"], solved: true },
    {
      id: 10,
      title: "Regular Expression Matching",
      difficulty: "Hard",
      topics: ["String", "Dynamic Programming"],
      solved: false,
    },
  ]

  // Calculate stats
  const totalProblems = problems.length
  const solvedProblems = problems.filter((p) => p.solved).length
  const solvedPercentage = (solvedProblems / totalProblems) * 100

  // Get unique topics for filter
  const allTopics = [...new Set(problems.flatMap((p) => p.topics))]

  // State for selected topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic))
    } else {
      setSelectedTopics([...selectedTopics, topic])
    }
  }

  return (
    <div className="container mx-auto md:px-25 ">
      <Header></Header>
      {/* Compact Progress Card */}
      {/* <div className="flex flex-wrap gap-6 mb-8 items-center">
        <Card className="bg-white shadow-sm p-4 flex items-center gap-4">
          <div className="relative h-16 w-16">
            <svg className="h-16 w-16" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f0f0f0" strokeWidth="2" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray={`${solvedPercentage} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{solvedPercentage.toFixed(0)}%</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Your Progress</div>
            <div className="text-2xl font-bold">
              {solvedProblems} <span className="text-sm text-muted-foreground">/ {totalProblems}</span>
            </div>
            <div className="flex gap-3 mt-1 text-xs">
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                <span className="text-green-600 font-medium">
                  {problems.filter((p) => p.difficulty === "Easy" && p.solved).length} Easy
                </span>
              </span>
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
                <span className="text-yellow-600 font-medium">
                  {problems.filter((p) => p.difficulty === "Medium" && p.solved).length} Medium
                </span>
              </span>
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                <span className="text-red-600 font-medium">
                  {problems.filter((p) => p.difficulty === "Hard" && p.solved).length} Hard
                </span>
              </span>
            </div>
          </div>
        </Card>
      </div> */}

      {/* Filters and Search */}
      <div className="mt-10 flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search problems..." className="pl-8 bg-white" />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white">
                Difficulty <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox id="easy" />
                  <label
                    htmlFor="easy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Easy
                  </label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox id="medium" />
                  <label
                    htmlFor="medium"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Medium
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hard" />
                  <label
                    htmlFor="hard"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Hard
                  </label>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="bg-white">
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
        </div>
      </div>

      {/* Topic Filter Cards */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Topics</h3>
        <div className="flex flex-wrap gap-2">
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedTopics.includes(topic)
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-white border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Problems List */}
      <Tabs defaultValue="all" className="mt-0">
        <div className="rounded-md border bg-white overflow-x-auto">
          <div className="min-w-[700px]">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Problems</TabsTrigger>
              <TabsTrigger value="solved">Solved</TabsTrigger>
              <TabsTrigger value="unsolved">Unsolved</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border bg-white">
                <div className="grid grid-cols-12 p-4 text-sm font-medium text-muted-foreground border-b">
                <div className="col-span-1">Status</div>
                <div className="col-span-1">ID</div>nowrap
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-3">Topics</div>
               </div>

              {problems.map((problem) => (
                <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className="grid grid-cols-12 p-4 text-sm border-b hover:bg-slate-50 transition-colors"
                >
                    <div className="col-span-1">
                    {problem.solved ? (
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                        </div>
                    ) : (
                        <div className="h-5 w-5 rounded-full border border-slate-200"></div>
                    )}
                    </div>
                    <div className="col-span-1 font-medium">{problem.id}</div>
                    <div className="col-span-5 font-medium text-blue-600">{problem.title}</div>
                    <div className="col-span-2">
                    <Badge
                        variant="outline"
                        className={
                        problem.difficulty === "Easy"
                            ? "text-green-500 border-green-200 bg-green-50"
                            : problem.difficulty === "Medium"
                            ? "text-yellow-500 border-yellow-200 bg-yellow-50"
                            : "text-red-500 border-red-200 bg-red-50"
                        }
                    >
                        {problem.difficulty}
                    </Badge>
                    </div>
                    <div className="col-span-3 flex flex-wrap gap-1">
                    {problem.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                        {topic}
                        </Badge>
                    ))}
                    </div>
                </Link>
              ))}
              </div>
            </TabsContent>

            <TabsContent value="solved" className="mt-0">
            <div className="rounded-md border bg-white">
                {/* Same structure as above but filtered for solved problems */}
                <div className="grid grid-cols-12 p-4 text-sm font-medium text-muted-foreground border-b">
                <div className="col-span-1">Status</div>
                <div className="col-span-1">ID</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-3">Topics</div>
                </div>

                {problems
                .filter((p) => p.solved)
                .map((problem) => (
                    <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className="grid grid-cols-12 p-4 text-sm border-b hover:bg-slate-50 transition-colors"
                    >
                    <div className="col-span-1">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                    <div className="col-span-1 font-medium">{problem.id}</div>
                    <div className="col-span-5 font-medium text-blue-600">{problem.title}</div>
                    <div className="col-span-2">
                        <Badge
                        variant="outline"
                        className={
                            problem.difficulty === "Easy"
                            ? "text-green-500 border-green-200 bg-green-50"
                            : problem.difficulty === "Medium"
                                ? "text-yellow-500 border-yellow-200 bg-yellow-50"
                                : "text-red-500 border-red-200 bg-red-50"
                        }
                        >
                        {problem.difficulty}
                        </Badge>
                    </div>
                    <div className="col-span-3 flex flex-wrap gap-1">
                        {problem.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                            {topic}
                        </Badge>
                        ))}
                    </div>
                    </Link>
                ))}
            </div>
            </TabsContent>

            <TabsContent value="unsolved" className="mt-0">
            <div className="rounded-md border bg-white">
                {/* Same structure as above but filtered for unsolved problems */}
                <div className="grid grid-cols-12 p-4 text-sm font-medium text-muted-foreground border-b">
                <div className="col-span-1">Status</div>
                <div className="col-span-1">ID</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-3">Topics</div>
                </div>

                {problems
                .filter((p) => !p.solved)
                .map((problem) => (
                    <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className="grid grid-cols-12 p-4 text-sm border-b hover:bg-slate-50 transition-colors"
                    >
                    <div className="col-span-1">
                        <div className="h-5 w-5 rounded-full border border-slate-200"></div>
                    </div>
                    <div className="col-span-1 font-medium">{problem.id}</div>
                    <div className="col-span-5 font-medium text-blue-600">{problem.title}</div>
                    <div className="col-span-2">
                        <Badge
                        variant="outline"
                        className={
                            problem.difficulty === "Easy"
                            ? "text-green-500 border-green-200 bg-green-50"
                            : problem.difficulty === "Medium"
                                ? "text-yellow-500 border-yellow-200 bg-yellow-50"
                                : "text-red-500 border-red-200 bg-red-50"
                        }
                        >
                        {problem.difficulty}
                        </Badge>
                    </div>
                    <div className="col-span-3 flex flex-wrap gap-1">
                        {problem.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                            {topic}
                        </Badge>
                        ))}
                    </div>
                    </Link>
                ))}
            </div>
            </TabsContent>
          </div>
        </div>

      </Tabs>
    </div>
  )
}
