#!/bin/bash

# Function to create a placeholder component
create_placeholder() {
    local path=$1
    local name=$2
    if [ ! -f "$path/page.tsx" ]; then
        echo "import React from 'react'

export default function $name() {
  return (
    <div>
      <h1>$name</h1>
      <p>This is a placeholder for the $name page.</p>
    </div>
  )
}
" > "$path/page.tsx"
        echo "Created placeholder for $name"
    else
        echo "Skipping $name, page.tsx already exists"
    fi
}

# Create main directories (if they don't exist)
mkdir -p app/{auth,public,dashboard/{teacher,student},settings} components/{layout,auth,dashboard/{teacher,student}} lib/{utils,api} hooks

# Create public pages
mkdir -p app/public/{about,features,pricing,contact}
create_placeholder "app/public/about" "About"
create_placeholder "app/public/features" "Features"
create_placeholder "app/public/pricing" "Pricing"
create_placeholder "app/public/contact" "Contact"

# Create auth pages
mkdir -p app/auth/{login,register/{teacher,student},password-reset}
create_placeholder "app/auth/login" "Login"
create_placeholder "app/auth/register/teacher" "TeacherRegister"
create_placeholder "app/auth/register/student" "StudentRegister"
create_placeholder "app/auth/password-reset" "PasswordReset"

# Create teacher dashboard pages
mkdir -p app/dashboard/teacher/{overview,modul-management,class-management,learning-content,calendar}
create_placeholder "app/dashboard/teacher/overview" "TeacherOverview"
create_placeholder "app/dashboard/teacher/modul-management" "ModulManagement"
create_placeholder "app/dashboard/teacher/class-management" "ClassManagement"
create_placeholder "app/dashboard/teacher/learning-content" "LearningContent"
create_placeholder "app/dashboard/teacher/calendar" "TeacherCalendar"

# Create student dashboard pages
mkdir -p app/dashboard/student/{my-classes,learning-space,calendar}
create_placeholder "app/dashboard/student/my-classes" "MyClasses"
create_placeholder "app/dashboard/student/learning-space" "LearningSpace"
create_placeholder "app/dashboard/student/calendar" "StudentCalendar"

# Create settings pages
mkdir -p app/settings/{profile,notifications,preferences}
create_placeholder "app/settings/profile" "Profile"
create_placeholder "app/settings/notifications" "Notifications"
create_placeholder "app/settings/preferences" "Preferences"

# Create placeholder files for other directories (if they don't exist)
touch components/layout/.gitkeep
touch components/auth/.gitkeep
touch components/dashboard/teacher/.gitkeep
touch components/dashboard/student/.gitkeep
touch lib/utils/.gitkeep
touch lib/api/.gitkeep
touch hooks/.gitkeep

echo "Project structure has been updated successfully!"