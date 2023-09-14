---
title: Using S3 for Hosting Website Resources
description: Learn how to use Amazon S3 to host website resources such as PDFs.
date: '2023-09-12'
categories:
  - Amazon S3
  - Web Development
published: true
---

# Exploring Amazon S3: Hosting My Resume for My Personal Website

As I continued to build my personal software engineering projects and develop my own website, I recently encountered a challenge that required me to dive into the world of Amazon S3 (Simple Storage Service). The task at hand was to serve my resume, a PDF file, on my website. Initially, I attempted to include the PDF in my website's source files, but I quickly ran into issues with relative routing. After some research, I decided to try hosting the file in an Amazon S3 bucket, even though I had never done it before. Surprisingly, the process turned out to be straightforward and efficient.

Here's how I went about hosting my resume on Amazon S3:

## Create an Amazon S3 Bucket
  - First, I logged into my AWS (Amazon Web Services) account and navigated to the Amazon S3 dashboard. From there, I clicked on the "Create bucket" button.
  - I provided a unique name for my bucket, making sure it was globally unique across all of AWS.

## Add My PDF to the Bucket
   - After creating the bucket, I went to its properties and selected the "Upload" option.
   - I selected my resume PDF file from my local machine and uploaded it to the bucket. 

## Adjust the Permissions Policy
   - To ensure that my resume would be accessible to the public, I needed to adjust the bucket's permissions policy.
   - I went to the "Permissions" tab for my bucket and clicked on "Bucket policy."
   - In the bucket policy editor, I added the following policy:

```json
{
   "Version": "2012-10-17",
   "Statement": [
       {
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::tylerpersonalsitebucket/*"
       }
   ]
}
```
  - This policy allows anyone to retrieve objects (in this case, my resume) from the specified resource.

## Retrieve the Object URL
  - Next, I needed to get the URL at which my resume file was hosted. To do this, I navigated to my bucket, found the resume PDF file, and clicked on it.
  - In the object details page, I found the "Object URL" which I would later use to link to my resume.

## Add the Resume Link to My Info Page
  - Finally, I went back to my website's code and added a link to my resume on my Info page, using the URL from Amazon S3.
  - The process was surprisingly smooth and didn't require any complex configurations. Amazon S3 makes it incredibly simple to host files for public access, and the flexibility it offers can be quite useful for various web projects. This experience gave me an opportunity to explore Amazon's flavor of storage, and I'm now confident in using Amazon S3 for future projects that require scalable and reliable storage solutions.