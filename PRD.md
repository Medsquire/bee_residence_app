# PRD GENERATION PROMPT — BEE RESIDENCE

Act as a Senior Product Manager, Business Analyst, UI/UX Designer, and Technical Architect.

Create a comprehensive, professional, developer-ready Product Requirements Document (PRD) for a residential management web application named **BEE Residence**, with the tagline **“Smart Living, Simplified.”**

The application is intended to help apartment residents manage visitors, home maintenance services, pre-approved guests, vehicles, notifications, and household members through one centralized platform.

The PRD must be detailed enough that a frontend developer can use it with GitHub Copilot or Antigravity in VS Code to build the complete React application without guessing important requirements.

Do not start coding the application. First, produce the PRD only.

## 1. Product Overview

Document the following:

- Product name: BEE Residence.
- Product type: Residential community management web application.
- Primary users: Apartment residents and household heads.
- Secondary users: Household members and security personnel.
- Primary goal: Simplify residential visitor management, maintenance requests, guest registration, vehicle management, and household communication.
- Platform: Responsive web application.
- Initial implementation: React frontend with mock data and LocalStorage persistence.
- Future direction: Backend integration, secure authentication, real-time synchronization, and integration with apartment security systems.

Explain the problem the product solves, the proposed solution, its value proposition, and the expected user benefits.

## 2. Product Goals and Success Criteria

Define measurable product goals, including:

- Reduce the time required to approve visitors.
- Make advance visitor registration straightforward.
- Allow residents to raise and track maintenance requests.
- Ensure household members can access shared household activity.
- Make important community announcements easy to find.
- Provide a consistent experience on desktop, tablet, and mobile.

For each goal, define an appropriate success metric and explain how it can be measured after launch. Do not invent baseline performance data.

## 3. User Personas and Roles

Define these personas:

### A. Household Head
- Logs in using a phone number and password.
- Manages household members.
- Approves or rejects visitor requests.
- Registers advance visitors.
- Adds and manages vehicles.
- Creates and tracks maintenance requests.
- Views notifications and community announcements.

### B. Household Member
- Views shared visitor requests and their statuses.
- Approves or rejects pending visitors when authorized.
- Creates and tracks service requests.
- Views guest passes, vehicle information, and notifications.
- Sees actions taken by other household members.

### C. Security Personnel
- Registers arriving visitors.
- Captures visitor details and photographs.
- Sends visitor approval requests to the appropriate household.
- Verifies advance visitor passes at the gate.

For the initial resident-facing frontend, security personnel functionality may be represented through realistic mock data and simulated visitor arrivals. Clearly distinguish this from a fully implemented security portal.

Define the permissions and responsibilities of each role.

## 4. Information Architecture and Navigation

Define the application navigation structure.

### Public route
- Login.

### Authenticated resident routes
- Dashboard.
- My Visitors.
- Pre-Approved Visitors.
- Home Services.
- My Vehicles.
- Notifications.
- Family Members.
- Profile & Settings.

Specify the purpose of every page, its major sections, navigation behavior, and how users move between related pages.

Include a sitemap or Mermaid diagram showing the route hierarchy.

## 5. Functional Requirements

Document each feature using:

- Feature ID.
- Feature name.
- Description.
- User story.
- Functional requirements.
- User interactions.
- Validation rules.
- Acceptance criteria.
- Error and empty states.
- Dependencies.
- Priority: P0, P1, or P2.

Use unique requirement IDs such as `AUTH-001`, `VIS-001`, and `SRV-001`.

### Module A: Authentication

Requirements:

- Phone number login with an India (+91) country code.
- Password input with show/hide functionality.
- Remember me checkbox.
- Forgot password interface.
- Form validation and helpful error messages.
- Demo login credentials for development.
- Protected application routes.
- Logout functionality.
- Persistent demo login state.

Clearly state that LocalStorage-based authentication is for demonstration only and is not production-secure authentication.

### Module B: Dashboard

Requirements:

- Personalized greeting.
- Apartment, tower, and flat information.
- Visitor approval count.
- Active service request count.
- Upcoming pre-approved visitor count.
- Registered vehicle count.
- Unread notification count.
- Recent visitor activity.
- Recent service requests.
- Community announcements.
- Quick actions for adding guests, vehicles, and service requests.

Define the behavior when a dashboard card is clicked and when no records are available.

### Module C: My Visitors

Visitor categories:

- Friends.
- Family.
- Courier.
- Food Delivery.
- Service Technician.
- Other.

Visitor records should include the available visitor name, photograph, purpose, arrival time, contact information, vehicle number if available, and security details.

Requirements:

- Pending, Approved, Rejected, Completed, and All Visitors views.
- Approve Entry action.
- Reject Entry action.
- Leave at Gate action.
- Visitor details view.
- Search and filtering.
- Visitor history.
- Confirmation dialogs where appropriate.
- Notifications when a visitor request arrives or its status changes.
- Shared household status updates.

Specify that a visitor request must be processed only once. If one authorized household member acts on a pending request, other members must see the updated status and must not be able to approve or reject the same request again.

Define the expected behavior of each visitor decision.

### Module D: Home Services

Service categories:

- Plumbing.
- Electrical Repairs.
- Water Pump and Motor.
- Cleaning.
- Sanitation.
- Air Conditioning.
- Washing Machine.
- Television.
- Wi-Fi and Internet.
- Carpentry.
- Painting.
- Pest Control.
- Refrigerator.
- Other Maintenance.

The service request form must include:

- Service category.
- Problem title.
- Detailed problem description.
- Optional photographs.
- Urgency: Urgent, High, Normal, or Can Wait.
- Preferred service date.
- Preferred time slot.
- Additional instructions.
- Resident's flat and contact details.

Define the service request lifecycle:

Pending → Approved → Scheduled → In Progress → Completed.

Cancelled requests should be handled as a separate terminal status. Define permitted transitions and clarify which transitions are available to residents and which require an authorized service administrator.

Each request must have a unique ticket ID, creation date, current status, preferred availability, and status history.

#### Mandatory service page behavior

The service request form must be hidden by default.

When the resident opens the Home Services page:

- Display the Add Service Request button.
- Display request summary cards.
- Display existing requests, if any.
- Display a helpful empty state if no previous requests exist.
- Never automatically display the request form.

Only after the resident clicks Add Service Request should the form become visible.

After successful submission:

- Generate a unique ticket ID.
- Save the request.
- Close or reset the form.
- Display a success message.
- Refresh the request list and summary counts.
- Make the request available to authorized household members.

Residents must be able to inspect previously requested and booked service slots without opening a new request form.

Define how preferred time slots differ from confirmed appointment slots.

### Module E: Pre-Approved Visitors

Requirements:

- Register visitors before arrival.
- Enter visitor name, phone number, category, purpose, visit date, arrival time, and validity period.
- Optionally record vehicle information and additional instructions.
- Generate a unique visitor pass ID.
- Generate a QR code and OTP.
- Display a visitor pass containing guest details, resident's flat number, validity period, and pass status.
- Copy OTP.
- Print or download the pass.
- Cancel a pass.
- Mark a pass as used in demo mode.
- Track upcoming, used, expired, and cancelled passes.

Define QR and OTP validation, expiration, and single-use rules for the future backend.

The PRD must explicitly distinguish simulated frontend pass generation from real gate verification.

### Module F: My Vehicles

Requirements:

- Add, edit, view, and remove vehicles.
- Vehicle type: Two-Wheeler, Car, Electric Vehicle, or Other.
- Registration number.
- Make and model.
- Color.
- Household owner.
- Optional parking slot.
- Optional vehicle photograph.
- Registration status.
- Duplicate registration validation within the household.

Specify number-plate formatting, form validation, confirmation dialogs, and empty states.

State that actual automated or barrier-free vehicle entry requires security-system integration.

### Module G: Notifications

Support these notification categories:

- Visitor requests and decisions.
- Service request updates.
- Technician appointment reminders.
- Pre-approved visitor reminders.
- Vehicle notices.
- Lift maintenance.
- Water supply interruptions.
- Electricity maintenance.
- Parking notices.
- Security alerts.
- Community announcements.

Requirements:

- Notification title, message, timestamp, category, read/unread state, and related record.
- Mark individual notifications as read.
- Mark all as read.
- Filter by All, Unread, Visitors, Services, and Community.
- Display an unread badge.
- Navigate to related records.
- Persist read status.
- Separate personal notifications from community-wide announcements.

Define how notifications are created in the frontend demo and how they should eventually be delivered through backend events, push notifications, email, or SMS.

### Module H: Family Members

Requirements:

- Household overview.
- Head of household identification.
- Add, edit, and remove household members.
- Member name, phone number, relationship, optional email, role, and account status.
- Duplicate phone number validation within the household.
- Household activity visibility.
- Shared visitor approvals.
- Shared service requests.
- Shared guest passes.
- Relevant household notifications.
- Activity history showing who performed an action and when.

Define household-level data ownership and role-based permissions.

For the demo, shared records should use a common household data model. Explain that LocalStorage does not synchronize data between separate devices or browsers.

### Module I: Profile and Settings

Requirements:

- Personal information.
- Phone number and email.
- Apartment name, building, tower, and flat number.
- Edit profile.
- Change password interface.
- Notification preferences.
- Logout.

Identify fields that require server-side verification in production.

## 6. UI/UX and Design System Requirements

Define the visual design for BEE Residence.

Brand direction:
- Professional residential SaaS product.
- Deep navy blue as the primary color.
- Warm golden yellow as the brand accent.
- White cards and soft grey backgrounds.
- Green, amber, red, and blue status indicators.
- Modern sans-serif typography.
- Lucide React outline icons.
- Consistent spacing, borders, shadows, and rounded corners.

Specify:

- Login page layout.
- Desktop sidebar and top navigation.
- Mobile navigation.
- Dashboard grid.
- Cards, tables, forms, drawers, and modals.
- Status badges.
- Search and filter components.
- Toast notifications.
- Loading, error, empty, and success states.
- Keyboard navigation and accessible labels.
- Responsive behavior across desktop, tablet, and mobile.

Require a consistent design system rather than unrelated page designs.

## 7. Screen Inventory

Create a screen specification table containing:

- Screen ID.
- Screen name.
- Route.
- Primary purpose.
- Main UI components.
- Primary user actions.
- Empty states.
- Loading/error states.
- Responsive considerations.

Include at least the login screen, dashboard, visitor list, visitor details, service list, service request form, service details, pre-visitor list, guest pass, vehicle list, add/edit vehicle, notification center, family members, add/edit family member, and profile settings.

## 8. User Flows

Document the complete step-by-step flows for:

1. Logging in and reaching the dashboard.
2. Receiving and approving a visitor.
3. Rejecting a visitor or instructing security to leave them at the gate.
4. Creating a home service request.
5. Viewing an existing service booking without opening the request form.
6. Registering a guest and generating a QR code and OTP.
7. Adding a vehicle.
8. Reading a community announcement.
9. Adding a household member.
10. One family member approving a visitor and another member seeing the updated state.
11. Logging out.

Include a Mermaid flowchart for the most important workflows.

## 9. Data Model

Define entities, attributes, data types, relationships, and validation requirements for:

- User.
- Household.
- Visitor.
- VisitorDecision.
- PreApprovedVisitorPass.
- ServiceRequest.
- ServiceStatusHistory.
- Vehicle.
- Notification.
- CommunityAnnouncement.
- FamilyMember.
- ActivityLog.

Use unique IDs and household IDs to connect related records.

Explain which fields are required, which are optional, and how records should be associated with a household.

Include example JSON objects for the most important entities.

## 10. Technical Requirements

The frontend technology stack is:

- React.
- Vite.
- JavaScript and JSX.
- Tailwind CSS.
- React Router DOM.
- Lucide React.
- React Hook Form where appropriate.
- LocalStorage for demo persistence.
- A QR code library.

Specify:

- Component architecture.
- Route structure.
- State management.
- Form validation.
- Data access services.
- Reusable UI components.
- Error handling.
- Date and time formatting.
- File upload previews and validation.
- LocalStorage initialization and migration considerations.
- Environment configuration.
- Future API integration boundaries.

Recommend a maintainable folder structure and explain the responsibilities of the main folders.

## 11. Non-Functional Requirements

Cover:

- Responsive design.
- Accessibility.
- Usability.
- Performance.
- Maintainability.
- Error recovery.
- Data consistency.
- Privacy.
- Security.
- Browser compatibility.
- Input validation.
- Image upload limits.
- Appropriate loading feedback.

Clearly separate requirements that can be achieved in the frontend demo from those requiring backend infrastructure.

## 12. Acceptance Criteria and Testing

Create testable acceptance criteria for every P0 feature.

Include test cases for:

- Valid and invalid login.
- Protected routes.
- Visitor approval and rejection.
- Preventing duplicate visitor decisions.
- Service form hidden by default.
- Opening the form only after clicking Add Service Request.
- Required field validation.
- Successful service request creation.
- Unique ticket ID generation.
- Filtering service requests.
- Generating and displaying a guest QR code and OTP.
- Expired and cancelled guest passes.
- Duplicate vehicle registration prevention.
- Notification read/unread behavior.
- Shared household state in the demo.
- Persistence after page refresh.
- Empty and error states.
- Mobile navigation.
- Logout.

For each test, provide the test ID, preconditions, steps, expected result, and priority.

## 13. Prioritization and Delivery Plan

Use MoSCoW prioritization:

- Must Have.
- Should Have.
- Could Have.
- Won't Have in the initial release.

Define a realistic MVP that prioritizes login demo, dashboard, visitor approvals, home service requests, pre-approved visitors, vehicles, notifications, and family members.

Separate frontend-demo deliverables from future backend and security integrations.

## 14. Risks, Assumptions, and Open Questions

List:

- Product assumptions.
- Technical constraints.
- Privacy risks.
- Household data consistency risks.
- OTP and QR code security risks.
- Risks of storing data in LocalStorage.
- Dependencies on external security systems.
- Features requiring a backend.
- Questions that need clarification before production implementation.

Do not invent confirmed business policies where the requirements are unknown. State reasonable assumptions explicitly.

## 15. Required PRD Output Format

Produce the PRD using the following structure:

1. Document information and version.
2. Executive summary.
3. Problem statement.
4. Product vision.
5. Goals and success metrics.
6. Scope and exclusions.
7. Personas and permissions.
8. Information architecture.
9. Functional requirements by module.
10. Screen inventory.
11. User flows.
12. UI/UX specifications.
13. Data model.
14. Technical architecture.
15. Non-functional requirements.
16. Acceptance criteria.
17. Testing strategy.
18. Prioritization and roadmap.
19. Risks and assumptions.
20. Open questions.
21. Definition of Done.

Use clear professional English, structured headings, tables where appropriate, numbered requirements, and actionable acceptance criteria.

Make the document detailed, internally consistent, and directly usable by a React frontend developer working with GitHub Copilot or Antigravity.

Do not generate application code. Finish the PRD first.