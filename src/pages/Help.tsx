import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Search } from 'lucide-react';
  
  const faqs = [
    {
      question: 'How do I create a new task?',
      answer: 'Click the "Add Task" button in the top right corner of the Task Board. Fill in the task details including title, description, priority, and due date.',
    },
    {
      question: 'Can I share tasks with team members?',
      answer: 'Yes! You can assign tasks to team members by selecting their name from the dropdown menu when creating or editing a task.',
    },
    {
      question: 'How does the AI assistant work?',
      answer: 'Our AI assistant analyzes your tasks and provides personalized suggestions for better task management. Simply ask questions about your tasks, and it will provide relevant insights.',
    },
    {
      question: 'How do I use the calendar view?',
      answer: 'The calendar view shows all your tasks organized by date. Click on any date to see tasks due on that day. You can also drag and drop tasks to reschedule them.',
    },
    {
      question: 'What do the different task priorities mean?',
      answer: 'Tasks can be set to High (red), Medium (yellow), or Low (green) priority. This helps you focus on the most important tasks first.',
    },
  ];
  
  export function Help() {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-black mb-6">Help Center</h1>
  
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search help articles..."
                    className="pl-9 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
  
          <div className="space-y-6">
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full border-2 border-black bg-[#4CAF50] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  View Documentation
                </Button>
              </CardContent>
            </Card>
  
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border-2 border-black p-4 hover:bg-gray-50">
                  <h3 className="font-semibold">Getting Started</h3>
                  <p className="text-sm text-gray-600">Learn the basics in 5 minutes</p>
                </div>
                <div className="rounded-lg border-2 border-black p-4 hover:bg-gray-50">
                  <h3 className="font-semibold">Task Management</h3>
                  <p className="text-sm text-gray-600">Master task organization</p>
                </div>
                <div className="rounded-lg border-2 border-black p-4 hover:bg-gray-50">
                  <h3 className="font-semibold">Team Collaboration</h3>
                  <p className="text-sm text-gray-600">Work better together</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }