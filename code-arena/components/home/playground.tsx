"use client"
import { Button } from "@/components/ui/button";
import { Code2, Play, Copy } from "lucide-react";
import { useState } from "react";

const codeSnippets: Record<string, string> = {
  Python: `# Definition for singly-linked list.
class ListNode(object):
    def __init__(self, x):
        self.val = x
        self.next = None

def stringToListNode(input):
    # Generate list from the input
    numbers = json.loads(input)

    # Now convert that list into linked list
    dummyRoot = ListNode(0)
    ptr = dummyRoot
    for number in numbers:
        ptr.next = ListNode(number)
        ptr = ptr.next

    return dummyRoot.next`,
  Java: `class ListNode {
  int val;
  ListNode next;
  ListNode(int x) {
    val = x;
    next = null;
  }
}`,
  "C++": `class ListNode {
public:
  int val;
  ListNode *next;
  ListNode(int x) : val(x), next(NULL) {}
};`,
};

export default function CodePlayground() {
  const [language, setLanguage] = useState("Python");

  return (
    <section className="bg-muted py-20">
      <div className="container px-4 mx-auto text-center">
        <div className="mb-10">
          <Code2 className="mx-auto mb-4 h-10 w-10 text-teal-500" />
          <h2 className="text-2xl font-semibold">Developer</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-2">
            We support popular coding languages. Explore, test, and write code visually just like in real environments.
          </p>
        </div>

        <div className="bg-background rounded-xl shadow-md overflow-hidden mx-auto max-w-4xl">
          {/* Tabs */}
          <div className="flex border-b text-sm">
            {Object.keys(codeSnippets).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-6 py-2 transition-all ${
                  language === lang
                    ? "border-b-2 border-teal-500 font-medium text-teal-600"
                    : "text-muted-foreground"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Code */}
          <div className="relative bg-[#f9fafb] text-left text-sm font-mono p-6 overflow-auto whitespace-pre-wrap leading-relaxed">
            <pre className="text-gray-800">{codeSnippets[language]}</pre>

            {/* Actions */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                <Copy className="w-3 h-3" /> Copy
              </Button>
              <Button size="sm" variant="default" className="text-xs flex items-center gap-1">
                <Play className="w-3 h-3" /> Run
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
