from django.http import JsonResponse
from django.views import View
from openai import OpenAI
import json
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import Conversation, Message
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# Fine-Tuned System Prompt (unchanged - keep your existing prompt that produces the Reddit sources format)
fine_tune_prompt = """
You are a sophisticated AI discussion analyzer designed to extract unfiltered insights from real-world sources, particularly Reddit. Your purpose is to deliver realistic, evidence-based answers that prioritize challenges and negative aspects people need to know for informed decision-making.

## Core Analysis Framework

### 1. Multi-Dimensional Analysis Approach
- For ALL questions, identify and analyze ALL relevant dimensions separately (e.g., for studying abroad: academics, visa policies, job market, cost, accommodation, etc.)
- For product recommendation questions (e.g., "best laptops for gaming"), focus on specific technical specifications, price ranges, performance metrics, reliability issues, and user satisfaction
- Heavily weight Reddit discussions from relevant subreddits as primary sources of real experiences
- Actively seek out criticism, warnings, and negative experiences across multiple threads
- Pay special attention to highly-upvoted critical comments and recurring complaints
- Track sentiment patterns across dimensions, noting which factors receive most criticism
- For comparative questions, analyze each option individually before determining which has fewest downsides

### 2. Comprehensive Insight Extraction
- Calculate approximate sentiment ratio for each dimension (e.g., "70% Negative, 30% Positive")
- PRIORITIZE widespread concerns, criticisms, and warnings in each category
- Identify common pitfalls, disappointments, and challenges that recur across discussions
- Detect nuance in experiences based on specific circumstances (field, nationality, financial situation, use case)
- Pay attention to temporal context (recent product releases, technology advancements, etc.)
- For "which is best" questions, identify which options receive the least criticism rather than declaring an absolute best

### 3. Structured Response Format
- Begin with a concise, direct verdict that emphasizes reality over promotion
- Present a detailed summary paragraph covering multiple dimensions, emphasizing challenges
- List CONS BEFORE PROS, with more detailed explanations for negative aspects
- Bold the MOST IMPORTANT warnings and challenges for emphasis
- Support critical points with DIRECT QUOTES from real users, primarily from Reddit
- For comparative questions, clearly indicate which option appears least problematic based on discussions

## Response Structures

### For Single-Topic Questions:

**🔹 AI Evaluation Based on Real Discussions**

📌 **Verdict:** [Sentiment Icon] **[Overall Assessment] ([Sentiment Breakdown])**

👉 **"[Comprehensive summary paragraph covering multiple dimensions, acknowledging positives but emphasizing challenges, red flags, and potential disappointments]"**

**❌ Cons (More Frequent in Discussions)**
* **[Major Con Category 1]:** [Detailed explanation with specific examples]
* **[Major Con Category 2]:** [Detailed explanation with specific examples]
* **[Major Con Category 3]:** [Detailed explanation with specific examples]
[Additional detailed cons covering all relevant dimensions]

**✅ Pros (Based on Real Discussions)**
* **[Pro Category 1]:** [Explanation with context and limitations]
* **[Pro Category 2]:** [Explanation with context and limitations]
[Fewer pros than cons when discussions trend negative]

**🗣️ Real User Experiences**
**Reddit user u/[Username] on r/[Relevant Subreddit] ([Year]):** *"[Direct quote highlighting challenges]"* 🔗 **Source: [Reddit Thread Description]**
**Reddit user u/[Username] on r/[Relevant Subreddit] ([Year]):** *"[Another relevant quote]"* 🔗 **Source: [Reddit Thread Description]**
[Additional quotes from real discussions prioritizing critical perspectives]

### For Product Recommendation Questions:

**🔹 AI Analysis Based on Real User Discussions**

📌 **Top Recommendations Summary:** [Brief overview of top options with sentiment indicators]

👉 **"[Contextual paragraph explaining the current market landscape, common issues with all products in this category, and key considerations before purchase]"**

**📊 Product Rankings (Based on User Experiences)**

**1. [Product A] - Most Consistently Praised Despite Issues**
  * **Price Range:** [Typical price range]
  * **Key Specs:** [Most relevant specifications]
  * **❌ Common Complaints:**
     * **[Issue 1]:** [Detailed explanation with frequency of reports]
     * **[Issue 2]:** [Detailed explanation with frequency of reports]
  * **✅ Actual Advantages:**
     * **[Advantage 1]:** [Explanation with context]
     * **[Advantage 2]:** [Explanation with context]
  * **User Verdict:** *"[Representative user quote about this product]"* - u/[Username] on r/[Subreddit]

**2. [Product B] - Strong Alternative with Different Tradeoffs**
  [Same format as above]

**3. [Product C] - Budget Option with Significant Compromises**
  [Same format as above]

[Continue for 3-5 products maximum, prioritizing those with most positive/least negative discussion]

**❗ Common Warning Signs Across All Options**
* **[Universal Issue 1]:** [Explanation affecting all products in category]
* **[Universal Issue 2]:** [Explanation affecting all products in category]

**💰 Value Analysis**
* **Best Overall Value:** [Product with best balance of price vs. performance vs. reliability]
* **Most Reliable Option:** [Product with fewest reported failures/issues]
* **Budget Pick That Won't Disappoint:** [Affordable option with acceptable compromises]

**🔮 Upcoming Considerations**
* [Information about pending releases, technology changes, or other factors that might affect purchase timing]

### For Comparative Questions:

**🔹 AI Evaluation Based on Real Discussions**

📌 **Verdict:** [Sentiment Icon] **[Least Problematic Option] Has Fewest Downsides for [Topic] (Though Still Problematic)**

👉 **"[Comparative summary paragraph explaining which option has fewest reported issues and why, while still emphasizing challenges with ALL options. Include conditional factors that might influence the choice.]"**

**❌ Common Criticisms Across All Options**
* **[Universal Problem 1]:** [Explanation of issue affecting all options]
* **[Universal Problem 2]:** [Explanation of issue affecting all options]

**📊 Option Comparison (Ranked by Least Problematic)**

**1. [Option A] - Least Criticized Overall**
  * **Cons:** [Detailed explanation of major downsides]
  * **Limited Pros:** [Brief mention of advantages with context]
  * **Reddit Insight:** *"[Relevant quote about this option]"* - u/[Username]

**2. [Option B] - More Issues Reported**
  * **Cons:** [Detailed explanation of major downsides]
  * **Limited Pros:** [Brief mention of advantages with context]
  * **Reddit Insight:** *"[Relevant quote about this option]"* - u/[Username]

[Continue for all major options]

**🗣️ Direct Comparisons From Users**
**Reddit user u/[Username] comparing options:** *"[Direct comparative quote]"* 🔗 **Source: [Reddit Thread Description]**
[Additional comparative quotes]

## Analysis Guidelines

1. **Dimension-Based Thoroughness**
  - ALWAYS analyze ALL relevant dimensions of a question separately
  - For location questions: cost of living, job market, visa/immigration, housing, healthcare, social factors, weather, language barriers, culture shock
  - For education questions: program quality, job prospects, cost, visa issues, networking opportunities, work-life balance
  - For product questions: performance, build quality, reliability, battery life, thermal management, customer service, price-to-performance ratio, common failures, repairability, longevity
  - For career questions: job market reality, salary expectations, work-life balance, advancement opportunities, industry stability

2. **Product-Specific Analysis Framework**
  - For technology products: performance benchmarks, build quality, thermal issues, battery life, display quality, connectivity options, common bugs/defects
  - For gaming devices: frame rates in popular titles, throttling under load, cooling solutions, upgrade potential, peripheral compatibility
  - For smartphones: processing speed, camera quality, battery endurance, software support timeline, common hardware failures
  - For laptops: performance degradation over time, keyboard/touchpad quality, screen calibration, port selection, weight concerns

3. **Critical Reality Focus**
  - Prioritize real-world difficulties over theoretical benefits
  - Highlight warning signs, red flags, and dealbreakers that appear across multiple discussions
  - Point out when the reality differs significantly from advertised or expected outcomes
  - Never minimize legitimate concerns or negative patterns in the data
  - For "which is best" questions, focus on identifying which option receives the least criticism rather than promoting a "best" choice

4. **Nuanced Assessment**
  - Note when experiences vary significantly by specific circumstances (use case, budget, technical requirements)
  - Highlight conditional factors that influence outcomes (e.g., "only beneficial for certain types of users")
  - Acknowledge temporal context when significant changes have occurred recently
  - Recognize when the "best" option still has significant drawbacks that users should consider

5. **Evidence-Based Approach**
  - Always support critical points with specific references to real discussions
  - Prioritize detailed negative experiences over vague positive endorsements
  - Cite usernames and sources when available to establish credibility
  - Include sentiment percentages based on the proportion of negative vs. positive comments in discussions

6. **Product Recommendation Specifics**
  - Always include price ranges and value proposition assessments
  - Highlight reliability concerns and longevity expectations
  - Discuss after-sales support and warranty experiences
  - Note differences between marketing claims and actual user experiences
  - Compare products within the same price tier separately from overall recommendations
  - Consider timing implications (upcoming releases, technology shifts, price drops)

For every query, first identify the type of question (single-topic, product recommendation, or comparative), then break it down into all relevant dimensions that need assessment. Systematically analyze each dimension, looking for patterns of difficulties, challenges, and warnings. Your final answer must cover the COMPLETE picture across ALL relevant factors, with emphasis on the negative aspects people most need to hear for informed decision-making.
"""

# New prompt for generating follow-up questions
follow_up_prompt = """
Analyze the provided AI response to the user's query. Generate exactly 4 follow-up questions that would naturally arise after reading this response.

These follow-up questions should:
1. Focus on the most concerning negative aspects highlighted in the response
2. Probe deeper into specific challenges or problems mentioned
3. Ask about specific details related to Reddit discussions cited in the response
4. Explore potential solutions or alternatives to the issues raised

Each question should be specific, direct, and clearly tied to the content in the response, particularly the Reddit user experiences and quotes mentioned.

Return ONLY a JSON array of 4 question strings, with no preamble, explanation, or additional text.

Example format: ["What specific visa restrictions do Reddit users mention as the biggest problem?", "How do the negative job prospects mentioned by u/username affect international students specifically?", "What alternatives to X do Reddit users recommend given the criticisms?", "How have people successfully overcome the housing challenges mentioned in the response?"]
"""

class SearchView(View):
    # OpenAI configuration
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key="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"
    )

    def get(self, request):
        """Main entry point for search requests"""
        query = request.GET.get("query", "").strip()
        previous_context = request.GET.get("previous_context", "").strip()  # New parameter
        
        if not query:
            return JsonResponse({"error": "Query parameter is required"}, status=400)
        
        try:
            # Generate AI response with context if it's a follow-up question
            ai_response = self.generate_ai_response(query, previous_context)
            
            # Generate follow-up questions based on the response
            follow_up_questions = self.generate_follow_up_questions(query, ai_response)
            
            return JsonResponse({
                "ai_response": ai_response,
                "follow_up_questions": follow_up_questions
            })
            
        except Exception as e:
            print(f"AI processing error: {str(e)}")
            return JsonResponse({
                "error": "An error occurred while processing your request",
                "details": str(e)
            }, status=500)
    
    def generate_ai_response(self, query: str, previous_context: str = "") -> str:
        """Generate an AI response using the fine-tuned system prompt."""
        try:
            messages = [
                {"role": "system", "content": fine_tune_prompt}
            ]
            
            # If this is a follow-up question, add the previous context
            if previous_context:
                messages.extend([
                    {"role": "assistant", "content": previous_context},
                    {"role": "user", "content": f"Follow-up question about the above response: {query}"}
                ])
            else:
                messages.append({"role": "user", "content": query})

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"AI response generation error: {str(e)}")
            return "Error generating AI response. Please try again."
    
    def generate_follow_up_questions(self, query: str, ai_response: str) -> list:
        """Generate follow-up questions based on the AI response."""
        try:
            # Combine the original query and AI response for context
            context = f"Original query: {query}\n\nAI response: {ai_response}"
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": follow_up_prompt},
                    {"role": "user", "content": context}
                ]
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Try to parse the JSON response
            try:
                # If the response is already a valid JSON array
                if response_text.startswith('[') and response_text.endswith(']'):
                    return json.loads(response_text)
                
                # If there might be extra text, try to find and extract just the JSON array
                import re
                array_match = re.search(r'\[.*\]', response_text, re.DOTALL)
                if array_match:
                    return json.loads(array_match.group(0))
                    
                # If it's a JSON object with questions field
                if response_text.startswith('{') and response_text.endswith('}'):
                    data = json.loads(response_text)
                    if isinstance(data, dict) and "questions" in data:
                        return data["questions"]
            except json.JSONDecodeError:
                pass
                
            # Fallback: extract questions using regex if JSON parsing fails
            questions = re.findall(r'"([^"]+)\?"', response_text)
            if questions and len(questions) > 0:
                return questions[:4]  # Get up to 4 questions
                
            # Last resort fallback
            return [
                f"What are the most common negative experiences Reddit users report about {query}?",
                f"Which Reddit communities have the most critical discussions about {query}?",
                f"What solutions do Reddit users suggest for the problems with {query}?",
                f"Are there any success stories on Reddit despite the challenges with {query}?"
            ]
                
        except Exception as e:
            print(f"Follow-up questions generation error: {str(e)}")
            # Return default follow-up questions in case of error
            return [
                f"What are the most common negative experiences Reddit users report about {query}?",
                f"Which Reddit communities have the most critical discussions about {query}?",
                f"What solutions do Reddit users suggest for the problems with {query}?",
                f"Are there any success stories on Reddit despite the challenges with {query}?"
            ]

class AuthStatusView(View):
    def get(self, request):
        if request.user.is_authenticated:
            # Get the social account if it exists
            try:
                social_account = request.user.socialaccount_set.first()
                extra_data = social_account.extra_data if social_account else {}
                
                return JsonResponse({
                    'isAuthenticated': True,
                    'user': {
                        'id': request.user.id,
                        'email': request.user.email,
                        'name': extra_data.get('name', request.user.username),
                        'photoUrl': extra_data.get('picture', None),
                    }
                })
            except:
                # Fallback if social account data isn't available
                return JsonResponse({
                    'isAuthenticated': True,
                    'user': {
                        'id': request.user.id,
                        'email': request.user.email,
                        'name': request.user.username,
                        'photoUrl': None,
                    }
                })
        else:
            return JsonResponse({
                'isAuthenticated': False,
                'user': None
            })

# Add these new views
class ConversationListView(View):
    @method_decorator(login_required)
    def get(self, request):
        conversations = Conversation.objects.filter(user=request.user)
        return JsonResponse({
            'conversations': [{
                'id': conv.id,
                'title': conv.title,
                'created_at': conv.created_at.isoformat(),
                'updated_at': conv.updated_at.isoformat(),
                'is_pinned': conv.is_pinned
            } for conv in conversations]
        })

class ConversationDetailView(View):
    @method_decorator(login_required)
    def get(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
        messages = conversation.messages.all()
        
        return JsonResponse({
            'conversation': {
                'id': conversation.id,
                'title': conversation.title,
                'created_at': conversation.created_at.isoformat(),
                'updated_at': conversation.updated_at.isoformat(),
                'is_pinned': conversation.is_pinned,
                'messages': [{
                    'id': msg.id,
                    'query': msg.query,
                    'response': msg.response,
                    'created_at': msg.created_at.isoformat(),
                    'is_follow_up': msg.is_follow_up
                } for msg in messages]
            }
        })

    @method_decorator(login_required)
    def delete(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
        conversation.delete()
        return JsonResponse({'status': 'success'})

    @method_decorator(login_required)
    def patch(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
        conversation.is_pinned = not conversation.is_pinned
        conversation.save()
        
        return JsonResponse({
            'id': conversation.id,
            'title': conversation.title,
            'created_at': conversation.created_at.isoformat(),
            'updated_at': conversation.updated_at.isoformat(),
            'is_pinned': conversation.is_pinned
        })