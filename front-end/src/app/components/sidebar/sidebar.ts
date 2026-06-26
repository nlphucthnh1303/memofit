import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { LayoutService } from "../../services/layout.service";

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="bg-slate-50 border-r border-slate-200 hidden overflow-hidden md:flex flex-col justify-between items-end sticky top-0 h-[100dvh] overflow-y-auto shrink-0 z-20 relative group"
      style="contain: layout; will-change: width;"
      [class.w-64]="!layout.collapsed"
      [class.w-[76px]]="layout.collapsed"
      [class.items-end]="!layout.collapsed"
      [class.items-center]="layout.collapsed"
      [class.p-4]="true"
    >
      <div class="w-full flex items-center justify-between mb-4">
        <div
          [class.block]="!layout.collapsed"
          [class.hidden]="layout.collapsed"
          [class.pointer-events-none]="layout.collapsed"
        >
          
          <div class="flex items-center w-full h-12 shrink-0">
            <span
              class="font-bold text-xl text-blue-800 whitespace-nowrap ml-3"
            >
              Memofit
            </span>
          </div>
        </div>

        <div class="px-2">
          <button
            class="bg-white border border-slate-200 text-slate-500 hover:text-blue-600 rounded-full w-7 h-7 flex items-center justify-center shadow-md z-30 hidden md:flex"
            (click)="layout.toggle()"
            [class.rotate-180]="layout.collapsed"
          >
            <mat-icon class="text-sm scale-75">chevron_left</mat-icon>
          </button>
        </div>
      </div>

      <div class="w-full h-full flex flex-col justify-between relative">
        <div class="w-full flex flex-col items-center">
          
          <nav class="space-y-2 font-medium text-[15px] w-full flex flex-col">
            
            <a
              routerLink="/dashboard/overview"
              routerLinkActive="text-blue-700 bg-blue-50/80 !border-blue-700 font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex items-center hover:bg-slate-200/50 hover:text-slate-900 rounded-xl relative group/nav cursor-pointer text-slate-600 h-11 px-2.5 w-full"
              [class.justify-center]="layout.collapsed"
            >
              <div class="flex items-center justify-center shrink-0 w-8 h-8">
                <mat-icon
                  class="text-[20px] w-5 h-5 flex items-center justify-center"
                  >dashboard</mat-icon
                >
              </div>
              <span
                class="whitespace-nowrap overflow-hidden"
                [class.max-w-0]="layout.collapsed"
                [class.opacity-0]="layout.collapsed"
                [class.max-w-[180px]]="!layout.collapsed"
                [class.opacity-100]="!layout.collapsed"
                [class.ml-3]="!layout.collapsed"
              >
                Bảng điều khiển
              </span>
              @if (layout.collapsed) {
                <div
                  class="absolute left-16 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg font-sans whitespace-nowrap opacity-0 pointer-events-none group-hover/nav:opacity-100 shadow-lg z-50"
                >
                  Bảng điều khiển
                </div>
              }
            </a>

            
            <a
              routerLink="/dashboard/practice"
              routerLinkActive="text-blue-700 bg-blue-50/80 !border-blue-700 font-semibold"
              class="flex items-center hover:bg-slate-200/50 hover:text-slate-900 rounded-xl relative group/nav cursor-pointer text-slate-600 h-11 px-2.5 w-full"
              [class.justify-center]="layout.collapsed"
            >
              <div class="flex items-center justify-center shrink-0 w-8 h-8">
                <mat-icon
                  class="text-[20px] w-5 h-5 flex items-center justify-center"
                  >fitness_center</mat-icon
                >
              </div>
              <span
                class="whitespace-nowrap overflow-hidden"
                [class.max-w-0]="layout.collapsed"
                [class.opacity-0]="layout.collapsed"
                [class.max-w-[180px]]="!layout.collapsed"
                [class.opacity-100]="!layout.collapsed"
                [class.ml-3]="!layout.collapsed"
              >
                Luyện tập
              </span>
              @if (layout.collapsed) {
                <div
                  class="absolute left-16 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg font-sans whitespace-nowrap opacity-0 pointer-events-none group-hover/nav:opacity-100 shadow-lg z-50"
                >
                  Luyện tập
                </div>
              }
            </a>
            
            <a
              routerLink="/dashboard/vocabulary"
              routerLinkActive="text-blue-700 bg-blue-50/80 !border-blue-700 font-semibold"
              class="flex items-center hover:bg-slate-200/50 hover:text-slate-900 rounded-xl relative group/nav cursor-pointer text-slate-600 h-11 px-2.5 w-full"
              [class.justify-center]="layout.collapsed"
            >
              <div class="flex items-center justify-center shrink-0 w-8 h-8">
                <mat-icon
                  class="text-[20px] w-5 h-5 flex items-center justify-center"
                  >menu_book</mat-icon
                >
              </div>
              <span
                class="whitespace-nowrap overflow-hidden"
                [class.max-w-0]="layout.collapsed"
                [class.opacity-0]="layout.collapsed"
                [class.max-w-[180px]]="!layout.collapsed"
                [class.opacity-100]="!layout.collapsed"
                [class.ml-3]="!layout.collapsed"
              >
                Kho Từ vựng
              </span>
              @if (layout.collapsed) {
                <div
                  class="absolute left-16 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg font-sans whitespace-nowrap opacity-0 pointer-events-none group-hover/nav:opacity-100 shadow-lg z-50"
                >
                  Kho Từ vựng
                </div>
              }
            </a>

            
            <a
              routerLink="/dashboard/generate-questions"
              routerLinkActive="text-blue-700 bg-blue-50/80 !border-blue-700 font-semibold"
              class="flex items-center hover:bg-slate-200/50 hover:text-slate-900 rounded-xl relative group/nav cursor-pointer text-slate-600 h-11 px-2.5 w-full"
              [class.justify-center]="layout.collapsed"
            >
              <div class="flex items-center justify-center shrink-0 w-8 h-8">
                <mat-icon
                  class="text-[20px] w-5 h-5 flex items-center justify-center"
                  >auto_awesome</mat-icon
                >
              </div>
              <span
                class="whitespace-nowrap overflow-hidden"
                [class.max-w-0]="layout.collapsed"
                [class.opacity-0]="layout.collapsed"
                [class.max-w-[180px]]="!layout.collapsed"
                [class.opacity-100]="!layout.collapsed"
                [class.ml-3]="!layout.collapsed"
              >
                Tạo câu hỏi
              </span>
              @if (layout.collapsed) {
                <div
                  class="absolute left-16 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg font-sans whitespace-nowrap opacity-0 pointer-events-none group-hover/nav:opacity-100 shadow-lg z-50"
                >
                  Tạo câu hỏi
                </div>
              }
            </a>

            <div class="pt-2 w-full border-t border-slate-200/60 my-1"></div>

            
          </nav>
        </div>

        
        <div class="space-y-4 w-full flex flex-col items-center">
          
          <a
            routerLink="/dashboard/settings"
            routerLinkActive="text-blue-700 bg-blue-50/80 !border-blue-700 font-semibold"
            class="flex items-center hover:bg-slate-200/50 hover:text-slate-900 rounded-xl relative group/nav cursor-pointer text-slate-600 h-11 px-2.5 w-full"
            [class.justify-center]="layout.collapsed"
          >
            <div class="flex items-center justify-center shrink-0 w-8 h-8">
              <mat-icon
                class="text-[20px] w-5 h-5 flex items-center justify-center"
                >settings</mat-icon
              >
            </div>
            <span
              class="whitespace-nowrap overflow-hidden"
              [class.max-w-0]="layout.collapsed"
              [class.opacity-0]="layout.collapsed"
              [class.max-w-[180px]]="!layout.collapsed"
              [class.opacity-100]="!layout.collapsed"
              [class.ml-3]="!layout.collapsed"
            >
              Cài đặt
            </span>
            @if (layout.collapsed) {
              <div
                class="absolute left-16 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg font-sans whitespace-nowrap opacity-0 pointer-events-none group-hover/nav:opacity-100 shadow-lg z-50"
              >
                Cài đặt
              </div>
            }
          </a>
          

          
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-sans font-semibold hover:shadow-md active:scale-95 flex items-center justify-center relative group/nav h-11 w-full shrink-0"
            [class.px-1]="layout.collapsed"
            routerLink="/practice"
          >
            <div class="flex items-center justify-center shrink-0 w-8 h-8">
              <mat-icon class="text-[20px]">play_arrow</mat-icon>
            </div>
            <span
              class="whitespace-nowrap overflow-hidden text-[14px]"
              [class.max-w-0]="layout.collapsed"
              [class.opacity-0]="layout.collapsed"
              [class.max-w-[150px]]="!layout.collapsed"
              [class.opacity-100]="!layout.collapsed"
              [class.ml-1.5]="!layout.collapsed"
            >
              Luyện tập ngay
            </span>
            @if (layout.collapsed) {
              <div
                class="absolute left-16 bg-blue-800 text-white text-xs py-1.5 px-3 rounded-lg font-sans whitespace-nowrap opacity-0 pointer-events-none group-hover/nav:opacity-100 shadow-lg z-50"
              >
                Luyện tập ngay
              </div>
            }
          </button>
        </div>
      </div>
    </aside>

    
    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around items-center h-[72px] pb-[env(safe-area-inset-bottom)] px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
    >
      <a
        routerLink="/dashboard"
        routerLinkActive="text-blue-700"
        [routerLinkActiveOptions]="{ exact: true }"
        class="flex flex-col items-center justify-center w-[20%] h-full text-slate-500 hover:text-blue-600 transition-colors"
      >
        <mat-icon class="text-[24px] mb-1">dashboard</mat-icon>
        <span class="text-[10px] font-medium truncate w-full text-center"
          >Tổng quan</span
        >
      </a>
      <a
        routerLink="/vocabulary"
        routerLinkActive="text-blue-700"
        class="flex flex-col items-center justify-center w-[20%] h-full text-slate-500 hover:text-blue-600 transition-colors"
      >
        <mat-icon class="text-[24px] mb-1">menu_book</mat-icon>
        <span class="text-[10px] font-medium truncate w-full text-center"
          >Từ vựng</span
        >
      </a>

      
      <a
        routerLink="/practice"
        routerLinkActive="text-blue-700"
        class="flex flex-col items-center justify-center w-[20%] h-full text-slate-500 hover:text-blue-600 transition-colors relative"
      >
        <div
          class="absolute -top-5 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-4 border-slate-50"
        >
          <mat-icon class="text-[24px]">fitness_center</mat-icon>
        </div>
        <span class="text-[10px] font-medium mt-6 truncate w-full text-center"
          >Luyện tập</span
        >
      </a>

      <a
        routerLink="/generate-questions"
        routerLinkActive="text-blue-700"
        class="flex flex-col items-center justify-center w-[20%] h-full text-slate-500 hover:text-blue-600 transition-colors"
      >
        <mat-icon class="text-[24px] mb-1">quiz</mat-icon>
        <span class="text-[10px] font-medium truncate w-full text-center"
          >Tạo câu hỏi</span
        >
      </a>
      <a
        routerLink="/settings"
        routerLinkActive="text-blue-700"
        class="flex flex-col items-center justify-center w-[20%] h-full text-slate-500 hover:text-blue-600 transition-colors"
      >
        <mat-icon class="text-[24px] mb-1">settings</mat-icon>
        <span class="text-[10px] font-medium truncate w-full text-center"
          >Cài đặt</span
        >
      </a>
    </nav>
  `,
})
export class Sidebar {
  layout = inject(LayoutService);
}
