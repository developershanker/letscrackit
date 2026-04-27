if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/bhawanashanker/.gradle/caches/9.3.1/transforms/5a107e817694e2ba4fc98e5d4d0e967b/transformed/hermes-android-250829098.0.10-release/prefab/modules/hermesvm/libs/android.x86/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/bhawanashanker/.gradle/caches/9.3.1/transforms/5a107e817694e2ba4fc98e5d4d0e967b/transformed/hermes-android-250829098.0.10-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

